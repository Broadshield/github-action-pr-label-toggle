/* eslint-disable prefer-const */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/no-null */
import * as core from '@actions/core';
import * as github from '@actions/github';
import { WebhookPayload } from '@actions/github/lib/interfaces';
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
  github_token: string;
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
  github_token: 'ghp_1234567890',
  repository: 'Broadshield/api',
} as InputsInterfaceStrings;
const inputsBoolean: InputsInterfaceBooleans = {
  status: false,
  generate_only: true,
  use_job_name_as_prefix: false,
  use_emoji: true,
} as InputsInterfaceBooleans;
// Shallow clone original @actions/github context
let originalContext = { ...github.context };
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
  const outputs: Record<string, string> = {};
  beforeAll(() => {
    // Mock github context
    jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
      return {
        repo: 'api',
        owner: 'Broadshield',
      };
    });
    github.context.eventName = 'pull_request';
    jest.setTimeout(50_000);
    // Mock getInput
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name] ?? '';
    });
    jest.spyOn(core, 'getBooleanInput').mockImplementation((name: string) => {
      return inputsBoolean[name] ?? false;
    });
    jest.spyOn(core, 'setOutput').mockImplementation((name: string, value: string) => {
      outputs[name] = value;
    });
    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(console.log);
    jest.spyOn(core, 'warning').mockImplementation(console.log);
    jest.spyOn(core, 'info').mockImplementation(console.log);
    jest.spyOn(core, 'debug').mockImplementation(console.log);
  });
  afterAll(() => {
    // Restore @actions/github context
    github.context.ref = originalContext.ref;
    github.context.sha = originalContext.sha;

    // Restore
    jest.restoreAllMocks();
  });

  it('exits successfully', async () => {
    try {
      const actionOutput = await Action.run();
      expect(actionOutput).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
  it('creates titlecase label from job name', async () => {
    inputsBoolean.use_job_name_as_prefix = true;
    // Mock github context
    inputs.pr_number = '';
    github.context.payload = {
      number: 1,
    } as WebhookPayload;
    github.context.job = 'integration_tests';

    const lbls: Action.PullRequestLabels = [
      {
        id: 1,
        node_id: 'a',
        url: 'https://api.github.com/repos/Broadshield/api/labels/Integration%20Tests',
        name: 'Unit Tests Failed',
        description: null,
        color: '#d93f0b',
        default: true,
      },
      {
        id: 2,
        node_id: 'b',
        url: 'https://api.github.com/repos/Broadshield/api/labels/Integration%20Tests',
        name: 'Integration Test Success',
        description: null,
        color: '#d93f0b',
        default: true,
      },
    ];
    // const mockGetCurrentLabels = Action.getCurrentLabels as jest.Mock<
    //   Promise<Action.PullRequestLabels>
    // >;
    // mockGetCurrentLabels.mockImplementation(() => Promise.resolve(lbls));
    jest.spyOn(Action, 'getCurrentLabels').mockImplementation(() => Promise.resolve(lbls));
    const repos = repoSplit(undefined, github.context);
    expect(repos).toBeDefined();
    if (repos) {
      const octokit = github.getOctokit('fakeToken');
      const response = await Action.getCurrentLabels(octokit, repos, 1);
      expect(response).toEqual(lbls);
      const actionOutput = await Action.run();
      expect(actionOutput).toBe(true);
      expect(outputs.add_label_name).toBe('Integration Tests Failed');
      expect(outputs.remove_label_name).toBe('Integration Tests Success');
      expect(outputs.repository).toBe('Broadshield/api');
      expect(outputs.pr_number).toBe(1);

      // expect(response).toReturnWith(lbls);
    }
  });
  // it('creates label from job');
});
