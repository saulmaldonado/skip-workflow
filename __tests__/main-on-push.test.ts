import * as github from '@actions/github';
import * as command from '@actions/core/lib/command';
import run from '../src/run';
import { config } from '../src/config';

describe('Integration test: main (on push to master/main branch)', () => {
  const mockGithubToken = 'githubToken';
  const mockRepo = 'skip-workflow';
  const mockOwner = 'github-action';
  const mockPhrase = 'docs';
  const mockRefMain = 'refs/heads/main';
  const mockRefMaster = 'refs/heads/main';

  const mockEnv = {
    GITHUB_REPOSITORY: `${mockOwner}/${mockRepo}`,
    'INPUT_GITHUB-TOKEN': mockGithubToken,
    INPUT_PHRASE: mockPhrase,
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
    process.env.GITHUB_REF = mockRefMain;
    process.env.INPUT_SEARCH = JSON.stringify([
      'commit_messages',
      'pull_request',
    ]);

    const mockCommit = {
      commit: { message: 'docs: add docs', url: 'https://example.com' },
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

  it('should return when single commit matches with phrase', async () => {
    process.env.GITHUB_REF = mockRefMaster;
    process.env.INPUT_SEARCH = JSON.stringify([
      'commit_messages',
      'pull_request',
    ]);

    const mockCommit = {
      commit: { message: 'docs: add docs', url: 'https://example.com' },
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
