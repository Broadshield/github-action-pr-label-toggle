import * as core from '@actions/core';
import * as github from '@actions/github';

import type { Repo } from './interfaces';
import { prefixParser, repoSplit, undefinedOnEmpty } from './utils';

export default class ActionInputs {
  generate_only: boolean;

  label_prefix: string | undefined;

  pr_number: number;

  status: boolean;

  status_false_message: string;

  status_true_message: string;

  repos: Repo;

  github_token: string;

  addLabel: string;

  removeLabel: string;

  constructor() {
    const { context } = github;
    const { payload, job } = context;
    const { number: payload_pr_number } = payload;
    this.pr_number = undefinedOnEmpty(core.getInput('pr_number')) ?? payload_pr_number;
    if (!this.pr_number) {
      core.setFailed('This is not a pull_request event, and there was no pr_number provided!');
    }
    this.github_token =
      undefinedOnEmpty(core.getInput('github_token', { required: false })) ??
      process.env.GITHUB_TOKEN ??
      '';
    if (this.github_token.length === 0) {
      core.setFailed('github_token not supplied');
      throw new Error('No authentication token provided');
    }
    const use_emoji = core.getBooleanInput('use_emoji');
    const use_job_name_as_prefix = core.getBooleanInput('use_job_name_as_prefix');
    const default_success_suffix = use_emoji ? `✅` : 'Success';
    const default_failure_suffix = use_emoji ? `❌` : `Failed`;
    this.status_true_message =
      undefinedOnEmpty(core.getInput('status_true_message')) ?? default_success_suffix;
    this.status_false_message =
      undefinedOnEmpty(core.getInput('status_false_message')) ?? default_failure_suffix;
    this.label_prefix = use_job_name_as_prefix
      ? undefinedOnEmpty(core.getInput('label_prefix'))
      : prefixParser(job);
    this.generate_only = core.getBooleanInput('generate_only');
    this.status = core.getBooleanInput('status');

    const repository =
      undefinedOnEmpty(core.getInput('repository')) ?? process.env.GITHUB_REPOSITORY;

    const repos = repoSplit(repository, context);

    if (!repos) {
      core.setFailed('Action failed with error: No repository information available');
      throw new Error('No repository info available');
    }
    this.repos = repos;
    this.generate_only = core.getBooleanInput('generate_only');

    if (this.status === true) {
      this.addLabel = `${this.label_prefix} ${this.status_true_message}`;
      this.removeLabel = `${this.label_prefix} ${this.status_false_message}`;
    } else {
      this.addLabel = `${this.label_prefix} ${this.status_false_message}`;
      this.removeLabel = `${this.label_prefix} ${this.status_true_message}`;
    }
  }

  static load(): ActionInputs {
    return new ActionInputs();
  }
}
