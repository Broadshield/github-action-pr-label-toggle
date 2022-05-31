import * as core from '@actions/core';
import { Context } from '@actions/github/lib/context';

import { Repo } from './interfaces';

export function basename(path: string): string | null {
  if (!path) return null;
  const result = path.split('/').reverse()[0];
  core.debug(`Basename passed ${path} and returns ${result}`);
  return result;
}

export function stripRefs(path: string): string | null {
  if (!path) return null;
  const result = path.replace('refs/heads/', '').replace('refs/tags/', '');
  core.debug(`stripRefs passed ${path} and returns ${result}`);
  return result;
}

export function repoSplit(inputRepo: string | undefined | null, context: Context): Repo | null {
  const result: Repo = {} as Repo;
  if (inputRepo) {
    [result.owner, result.repo] = inputRepo.split('/');

    core.debug(`repoSplit passed ${inputRepo} and returns ${JSON.stringify(result)}`);
  } else if (process.env.GITHUB_REPOSITORY) {
    [result.owner, result.repo] = process.env.GITHUB_REPOSITORY.split('/');

    core.debug(
      `repoSplit using GITHUB_REPOSITORY ${process.env.GITHUB_REPOSITORY} and returns ${JSON.stringify(result)}`,
    );
  } else if (context.repo) {
    result.owner = context.repo.owner;
    result.repo = context.repo.repo;

    core.debug(
      `repoSplit using GITHUB_REPOSITORY ${process.env.GITHUB_REPOSITORY} and returns ${JSON.stringify(result)}`,
    );
  }
  if (result.repo && result.owner) {
    return result;
  }
  throw new Error("repoSplit requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
}

// Functions
