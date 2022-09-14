import * as core from '@actions/core';
import * as github from '@actions/github';
import { GetResponseTypeFromEndpointMethod } from '@octokit/types';

import { Repo } from './interfaces';
import { prefixParser, repoSplit } from './utils';

function undefinedOnEmpty(value: string | undefined): string | undefined {
  if (!value || value === '') {
    return undefined;
  }
  return value;
}

export async function run(): Promise<void> {
  try {
    const { context } = github;
    const { payload, eventName, job } = context;
    core.info(`Event type is: ${eventName}`);
    let { number } = payload;
    const use_emoji = core.getBooleanInput('use_emoji');
    const use_job_name_as_prefix = core.getBooleanInput('use_job_name_as_prefix');
    const default_success_suffix = use_emoji ? `✅` : 'Success';
    const default_failure_suffix = use_emoji ? `❌` : `Failed`;
    const status_true_message = undefinedOnEmpty(core.getInput('status_true_message')) ?? default_success_suffix;
    const status_false_message = undefinedOnEmpty(core.getInput('status_false_message')) ?? default_failure_suffix;
    const label_prefix = use_job_name_as_prefix ? core.getInput('label_prefix') : prefixParser(job);
    const status = core.getBooleanInput('status');
    const pr_number = undefinedOnEmpty(core.getInput('pr_number'));
    const repository = undefinedOnEmpty(core.getInput('repository'));
    const generate_only = core.getBooleanInput('generate_only');

    if (undefinedOnEmpty(label_prefix) === undefined) {
      core.warning('No label prefix was supplied');
      return;
    }
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
    type RemoveLabelResponseType = GetResponseTypeFromEndpointMethod<typeof octokit.rest.issues.removeLabel>;
    const promiseArray: Promise<RemoveLabelResponseType>[] = [];
    for (const l of labels) {
      if (l.name) {
        if (l.name.startsWith(removeLabel)) {
          core.notice(`Removing label ${removeLabel}`);
          promiseArray.push(octokit.rest.issues.removeLabel({ ...repos, issue_number: number, name: removeLabel }));
        }
        if (l.name.startsWith(addLabel)) {
          core.notice(`Label ${addLabel} already in place`);
          addLabelExists = true;
        }
      }
    }

    await Promise.all(promiseArray);

    if (addLabelExists === false) {
      core.notice(`Adding label ${addLabel}`);
      await octokit.rest.issues.addLabels({ ...repos, issue_number: number, labels: [addLabel] });
    }

    core.notice('Label update complete');
  } catch (error) {
    core.setFailed(`ERROR: ${error}`);
  }
}
