import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import type { components } from '@octokit/openapi-types';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

import ActionInputs from './inputs';
import { Repo } from './interfaces';

export type GithubOctokitType = InstanceType<typeof GitHub>;

export type PullRequestLabels = components['schemas']['pull-request']['labels'];

export async function removeExpiredLabels(
  octokit: GithubOctokitType,
  inputs: ActionInputs,
  labels: PullRequestLabels,
): Promise<RestEndpointMethodTypes['issues']['removeLabel']['response'] | undefined> {
  let foundExpiredLabel = false;
  for (const l of labels) {
    if (l.name && l.name.toLowerCase().startsWith(inputs.removeLabel.toLowerCase())) {
      core.notice(`Removing label ${inputs.removeLabel}`);
      foundExpiredLabel = true;
      break;
    }
  }

  if (foundExpiredLabel) {
    return octokit.rest.issues.removeLabel({
      ...inputs.repos,
      issue_number: inputs.pr_number,
      name: inputs.removeLabel,
    });
  }
}
export async function addCurrentLabels(
  octokit: GithubOctokitType,
  inputs: ActionInputs,
  labels: PullRequestLabels,
): Promise<RestEndpointMethodTypes['issues']['addLabels']['response'] | undefined> {
  let addLabelExists = false;
  for (const l of labels) {
    if (l.name && l.name.toLowerCase().startsWith(inputs.addLabel.toLowerCase())) {
      core.notice(`Label ${inputs.addLabel} already in place`);
      addLabelExists = true;
      break;
    }
  }
  if (addLabelExists === false) {
    core.notice(`Adding label ${inputs.addLabel}`);
    return octokit.rest.issues.addLabels({
      ...inputs.repos,
      issue_number: inputs.pr_number,
      labels: [inputs.addLabel],
    });
  }
}

export async function getCurrentLabels(
  octokit: GithubOctokitType,
  repos: Repo,
  pr_number: number,
): Promise<PullRequestLabels> {
  const pull_response: RestEndpointMethodTypes['pulls']['get']['response'] =
    await octokit.rest.pulls.get({ ...repos, pull_number: pr_number });
  return pull_response.data.labels;
}

export async function run(): Promise<void> {
  try {
    const inputs = ActionInputs.load();

    if (!inputs.label_prefix) {
      core.warning('No label prefix was supplied');
      return;
    }

    const octokit = github.getOctokit(inputs.github_token);
    core.setOutput('add_label_name', inputs.addLabel);
    core.setOutput('remove_label_name', inputs.removeLabel);
    core.setOutput('repository', inputs.repos);
    core.setOutput('pr_number', inputs.pr_number);

    if (inputs.generate_only === true) {
      // exit early
      core.notice('We did it team!');
      return;
    }

    const labels = await getCurrentLabels(octokit, inputs.repos, inputs.pr_number);
    await Promise.all([
      removeExpiredLabels(octokit, inputs, labels),
      addCurrentLabels(octokit, inputs, labels),
    ]);

    core.info('Label update complete');
  } catch (error) {
    core.setFailed(`ERROR: ${error}`);
  }
}
