import * as core from '@actions/core';
import * as github from '@actions/github';

import { Repo } from './interfaces';
import { repoSplit } from './utils';

function undefinedOnEmpty(value: string | undefined): string | undefined {
  if (!value || value === '') {
    return undefined;
  }
  return value;
}

export async function run(): Promise<void> {
  try {
    const { context } = github;
    const { payload } = context;
    core.info(`Event type is: ${context.eventName}`);
    let { number } = payload;

    const status_true_message = undefinedOnEmpty(core.getInput('status_true_message')) ?? 'Success';
    const status_false_message = undefinedOnEmpty(core.getInput('status_false_message')) ?? 'Failure';
    const label_prefix = undefinedOnEmpty(core.getInput('label_prefix')) ?? context.job;
    const status = core.getBooleanInput('status');
    const pr_number = undefinedOnEmpty(core.getInput('pr_number'));
    const repository = undefinedOnEmpty(core.getInput('repository'));
    const generate_only = core.getBooleanInput('generate_only');

    const github_token: string | undefined =
      undefinedOnEmpty(core.getInput('github_token', { required: false })) ?? process.env.GITHUB_TOKEN ?? undefined;
    if (!github_token) {
      core.setFailed('github_token not supplied');
      return;
    }
    const octokit = github.getOctokit(github_token);
    number = pr_number ?? number;
    if (!number) {
      core.setFailed('This is not a pull_request event, and there was no pr_number provided!');
    }
    let repos: null | Repo = null;
    try {
      repos = repoSplit(repository, context);
    } catch (error) {
      core.setFailed(`Action failed with error: ${error}`);
    }
    if (!repos) {
      core.setFailed('Action failed with error: No repository information available');
      return;
    }

    let addLabel;
    let removeLabel;
    if (status === true) {
      addLabel = `${label_prefix} ${status_true_message}`;
      removeLabel = `${label_prefix} ${status_false_message}`;
    } else {
      addLabel = `${label_prefix} ${status_false_message}`;
      removeLabel = `${label_prefix} ${status_true_message}`;
    }

    core.setOutput('add_label_name', addLabel);
    core.setOutput('remove_label_name', removeLabel);
    core.setOutput('repository', repos);
    core.setOutput('pr_number', number);

    if (generate_only === true) {
      // exit early
      core.notice('We did it team!');
      return;
    }

    core.debug(`The query fields: ${JSON.stringify({ ...repos, pull_number: number })}`);
    const pull_response = await octokit.rest.pulls.get({ ...repos, pull_number: number });

    const { labels } = pull_response.data;
    let addLabelExists = false;
    for (const l of labels) {
      if (l.name) {
        if (l.name.startsWith(removeLabel)) {
          core.notice(`Removing label ${removeLabel}`);
          await octokit.rest.issues.removeLabel({ ...repos, issue_number: number, name: removeLabel });
        }
        if (l.name.startsWith(addLabel)) {
          core.notice(`Label ${addLabel} already in place`);
          addLabelExists = true;
        }
      }
    }

    if (addLabelExists === false) {
      core.notice(`Adding label ${addLabel}`);
      await octokit.rest.issues.addLabels({ ...repos, issue_number: number, labels: [addLabel] });
    }

    core.notice('Label update complete');
  } catch (error) {
    core.setFailed(`ERROR: ${error}`);
  }
}
