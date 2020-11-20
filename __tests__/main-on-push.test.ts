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

  let getOctokitSpy: jest.SpyInstance;
  let issueCommandSpy: jest.SpyInstance;
  let getCommitSpy: jest.SpyInstance;

  beforeAll(async () => {
    jest.resetModules();

    process.env = { ...process.env, ...mockEnv };

    getOctokitSpy = jest.spyOn(github, 'getOctokit');
    getOctokitSpy.mockImplementation(() => mockOctokit);

    getCommitSpy = jest.spyOn(mockOctokit.repos, 'getCommit');

    issueCommandSpy = jest.spyOn(command, 'issueCommand');
  });

  afterAll(() => {
    jest.clearAllMocks();
    process.env = oldEnv;
  });

  it('should return when single commit matches with phrase', async () => {
    const mockPhrase = '[skip-workflow]';
    process.env.INPUT_PHRASE = mockPhrase;
    process.env.GITHUB_EVENT_NAME = mockEventName;
    process.env.INPUT_SEARCH = JSON.stringify([
      'commit_messages',
      'pull_request', // push should skip pull_request option
    ]);

    const mockCommit = {
      commit: {
        message: '[skip-workflow]: example commit for e2e test',
        url: 'https://example.com',
      },
      sha: '123456',
    };

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

  it('should return when single commit matches with RegExp', async () => {
    const mockRegex = '/^\\[skip-workflow\\]/gi';
    process.env.INPUT_PHRASE = mockRegex;
    process.env.GITHUB_EVENT_NAME = mockEventName;
    process.env.INPUT_SEARCH = JSON.stringify([
      'commit_messages',
      'pull_request', // push should skip pull_request option
    ]);

    const mockCommit = {
      commit: {
        message: '[skip-workflow]: example commit for e2e test',
        url: 'https://example.com',
      },
      sha: '123456',
    };

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
});
