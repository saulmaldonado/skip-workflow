import * as github from '@actions/github';
import * as command from '@actions/core/lib/command';
import run from '../src/run';
import { config } from '../src/config';

describe('Integration test: main (on push to master/main branch)', () => {
  const mockGithubToken = 'githubToken';
  const mockRepo = 'skip-workflow';
  const mockOwner = 'github-action';
  const mockEventName = 'push';
  const mockFailFast = 'false';

  const mockEnv = {
    GITHUB_REPOSITORY: `${mockOwner}/${mockRepo}`,
    'INPUT_GITHUB-TOKEN': mockGithubToken,
    'INPUT_FAIL-FAST': mockFailFast,
  };

  const oldEnv = { ...process.env };

  const mockOctokit = github.getOctokit(mockGithubToken);

  const mockCommit = [
    {
      commit: {
        message: '[skip-workflow]: example commit for e2e test',
        url: 'https://example.com',
      },
      sha: '123456',
    },
  ];

  const mockCommits = [
    {
      commit: {
        message: '[skip-workflow]: example commit for e2e test',
        url: 'https://example.com',
      },
      sha: '123456',
    },
    {
      commit: {
        message: '[skip-workflow]: another example commit for e2e test',
        url: 'https://example.com',
      },
      sha: '456789',
    },
  ];

  let getOctokitSpy: jest.SpyInstance;
  let issueCommandSpy: jest.SpyInstance;
  let getCommitSpy: jest.SpyInstance;

  beforeAll(async () => {
    jest.resetModules();

    process.env = { ...process.env, ...mockEnv };

    getOctokitSpy = jest.spyOn(github, 'getOctokit');
    getOctokitSpy.mockImplementation(() => mockOctokit);

    getCommitSpy = jest.spyOn(mockOctokit.repos, 'listCommits');

    issueCommandSpy = jest.spyOn(command, 'issueCommand');
  });

  afterAll(() => {
    jest.clearAllMocks();
    process.env = oldEnv;
  });

  it('should return true when single commit matches with phrase', async () => {
    const mockPhrase = '[skip-workflow]';
    process.env.INPUT_PHRASE = mockPhrase;
    process.env.GITHUB_EVENT_NAME = mockEventName;
    process.env.INPUT_SEARCH = JSON.stringify([
      'commit_messages',
      'pull_request', // push should skip pull_request option
    ]);

    getCommitSpy.mockImplementationOnce(() => ({ data: mockCommit }));

    await run();

    expect(issueCommandSpy).toBeCalledWith(
      'set-output',
      {
        name: config.MATCH_FOUND_OUTPUT_ID,
      },
      true,
    );
  });

  it('should return true when single commit matches with RegExp', async () => {
    const mockRegex = '/^\\[skip-workflow\\]/gi';
    process.env.INPUT_PHRASE = mockRegex;
    process.env.GITHUB_EVENT_NAME = mockEventName;
    process.env.INPUT_SEARCH = JSON.stringify([
      'commit_messages',
      'pull_request', // push should skip pull_request option
    ]);

    getCommitSpy.mockImplementationOnce(() => ({ data: mockCommit }));

    await run();

    expect(issueCommandSpy).toBeCalledWith(
      'set-output',
      {
        name: config.MATCH_FOUND_OUTPUT_ID,
      },
      true,
    );
  });

  it('should return true when multiple commits not including before push matches with phrase', async () => {
    const mockPhrase = '[skip-workflow]';
    process.env.INPUT_PHRASE = mockPhrase;
    process.env.GITHUB_EVENT_NAME = mockEventName;
    process.env.INPUT_SEARCH = JSON.stringify([
      'commit_messages',
      'pull_request', // push should skip pull_request option
    ]);
    process.env.GITHUB_EVENT_PATH = `${__dirname}/utils/pushEvent.json`; // path to mock push webhook payload json file

    const mockBeforeCommit = {
      commit: {
        message: 'example commit for e2e test',
        url: 'https://example.com',
      },
      sha: '159753',
    };

    getCommitSpy.mockImplementationOnce(() => ({
      data: [...mockCommits, mockBeforeCommit],
    }));

    await run();

    expect(issueCommandSpy).toBeCalledWith(
      'set-output',
      {
        name: config.MATCH_FOUND_OUTPUT_ID,
      },
      true,
    );
  });

  it('should return true when multiple commits not including before push matches with RegExp', async () => {
    const mockRegex = '/^\\[skip-workflow\\]/gi';
    process.env.INPUT_PHRASE = mockRegex;
    process.env.GITHUB_EVENT_NAME = mockEventName;
    process.env.INPUT_SEARCH = JSON.stringify([
      'commit_messages',
      'pull_request', // push should skip pull_request option
    ]);

    process.env.GITHUB_EVENT_PATH = `${__dirname}/utils/pushEvent.json`; // path to mock push webhook payload json file

    const mockBeforeCommit = {
      commit: {
        message: 'example commit for e2e test',
        url: 'https://example.com',
      },
      sha: '159753',
    };

    getCommitSpy.mockImplementationOnce(() => ({
      data: [...mockCommits, mockBeforeCommit],
    }));

    await run();

    expect(issueCommandSpy).toBeCalledWith(
      'set-output',
      {
        name: config.MATCH_FOUND_OUTPUT_ID,
      },
      true,
    );
  });
});
