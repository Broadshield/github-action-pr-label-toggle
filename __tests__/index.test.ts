import * as core from '@actions/core';
import * as github from '@actions/github';
import { Repo } from '../src/interfaces';
import { repoSplit } from '../src/utils';
import * as Action from '../src/action';

interface InputsInterfaceStrings {
  [key: string]: string;
  status_true_message: string;
  status_false_message: string;
  label_prefix: string;
  pr_number: string;
  repository: string;
}
interface InputsInterfaceBooleans {
  [key: string]: boolean;
  status: boolean;
  generate_only: boolean;
}

const inputs: InputsInterfaceStrings = {
  status_true_message: 'Success',
  status_false_message: 'Failed',
  label_prefix: 'Test',
  pr_number: '0',
} as InputsInterfaceStrings;
const inputsBoolean: InputsInterfaceBooleans = {
  status: false,
  generate_only: true,
} as InputsInterfaceBooleans;

describe('repoSplit utility', () => {
  // Mock github context
  jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
    return {
      repo: 'api',
      owner: 'Broadshield',
    };
  });
  github.context.eventName = 'push';

  const OLD_ENV = process.env;
  const repository = 'Broadshield/api';
  const result: Repo = {
    owner: 'Broadshield',
    repo: 'api',
  };

  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });

  test(`take string 'Broadshield/api' and returns object ${JSON.stringify(result)}`, () => {
    expect(repoSplit(repository, github.context)).toStrictEqual(result);
  });

  test(`take undefined, has environment variable GITHUB_REPOSITORY available and returns object ${JSON.stringify(
    result,
  )}`, () => {
    process.env.GITHUB_REPOSITORY = repository;
    expect(repoSplit(undefined, github.context)).toStrictEqual(result);
  });

  test(`take undefined, has context available and returns object ${JSON.stringify(result)}`, () => {
    delete process.env.GITHUB_REPOSITORY;

    expect(repoSplit(undefined, github.context)).toStrictEqual(result);
  });
});

describe('github-action-pr-label-toggle', () => {
  beforeAll(() => {
    jest.setTimeout(50_000);
    // Mock getInput
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name] ?? '';
    });
    jest.spyOn(core, 'getBooleanInput').mockImplementation((name: string) => {
      return inputsBoolean[name];
    });
    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(console.log);
    jest.spyOn(core, 'warning').mockImplementation(console.log);
    jest.spyOn(core, 'info').mockImplementation(console.log);
    jest.spyOn(core, 'debug').mockImplementation(console.log);
  });

  it('exits successfully', () => {
    expect(Action.run()).toHaveReturned();
  });
  it('creates titlecase label from job name', () => {
    // Mock github context
    jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
      return {
        repo: 'api',
        owner: 'Broadshield',
      };
    });
    jest.spyOn(github.context, 'eventName', 'get').mockImplementation(() => {
      return 'pull_request';
    });
    jest.spyOn(github.context, 'payload', 'get').mockImplementation(() => {
      return { number: 1 };
    });
    jest.spyOn(github.context, 'job', 'get').mockImplementation(() => {
      return 'integration_tests';
    });

    const repos = repoSplit(undefined, github.context)!;
    const octokit = github.getOctokit("fakeToken");
    expect(Action.getCurrentLabels(octokit, repos, 1));

  });
});
