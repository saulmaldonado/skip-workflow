// import { issueCommand } from '@actions/core/lib/command';
import * as github from '@actions/github';
import * as command from '@actions/core/lib/command';
import run from '../src/run';
import { config } from '../src/config';

describe('Integration Test: main', () => {
  const mockGithubToken = 'githubToken';

  const mockRepo = 'skip-workflow';
  const mockOwner = 'github-action';
  const mockPhrase = 'docs';

  const mockOctokit = github.getOctokit(mockGithubToken);

  let listCommitsSpy: jest.SpyInstance;
  let getOctokitSpy: jest.SpyInstance;
  let issueCommandSpy: jest.SpyInstance;
  let issueSpy: jest.SpyInstance;

  const mockPrId = 1;
  const mockRef = `refs/pull/${mockPrId}/merge`;

  const mockEnv = {
    GITHUB_REF: mockRef,
    GITHUB_REPOSITORY: `${mockOwner}/${mockRepo}`,
    'INPUT_GITHUB-TOKEN': mockGithubToken,
    INPUT_PHRASE: mockPhrase,
  };

  const oldEnv = { ...process.env };

  beforeAll(async () => {
    jest.resetModules();

    process.env = { ...process.env, ...mockEnv };

    getOctokitSpy = jest.spyOn(github, 'getOctokit');
    getOctokitSpy.mockImplementation(() => mockOctokit);

    listCommitsSpy = jest.spyOn(mockOctokit.pulls, 'listCommits');
    issueCommandSpy = jest.spyOn(command, 'issueCommand');
    issueSpy = jest.spyOn(command, 'issue');
  });

  afterAll(() => {
    jest.clearAllMocks();
    process.env = oldEnv;
  });

  //    command_1.issueCommand('set-output', { name }, value);

  // function issueCommand(command, properties, message) {
  //   const cmd = new Command(command, properties, message);
  //   process.stdout.write(cmd.toString() + os.EOL);

  it('should set output to true when all commit message match', async () => {
    const mockCommits = [
      {
        commit: { message: 'docs: add docs', url: 'https://example.com' },
        sha: '123456',
      },
      {
        commit: { message: 'docs: edit docs', url: 'https://example.com' },
        sha: '456789',
      },
    ];

    listCommitsSpy.mockImplementationOnce(() => ({ data: mockCommits }));

    await run();

    expect(issueCommandSpy).toBeCalledWith(
      'set-output',
      {
        name: config.MATCH_FOUND_OUTPUT_ID,
      },
      true,
    );
  });

  it("should set output to false when one or more commit messages don't match", async () => {
    const mockCommits = [
      {
        commit: { message: 'fix: fix code', url: 'https://example.com' },
        sha: '123456',
      },
      {
        commit: { message: 'docs: edit docs', url: 'https://example.com' },
        sha: '456789',
      },
    ];

    listCommitsSpy.mockImplementationOnce(() => ({ data: mockCommits }));

    await run();

    expect(issueCommandSpy).toBeCalledWith(
      'set-output',
      {
        name: config.MATCH_FOUND_OUTPUT_ID,
      },
      null,
    );
  });

  it('should fail and set error when an error is throw', async () => {
    const mockNetworkError = new Error('API not available');

    listCommitsSpy.mockImplementationOnce(() => {
      throw mockNetworkError;
    });

    await run();

    expect(process.exitCode).toBe(1);

    expect(issueSpy).toBeCalledWith('error', mockNetworkError.toString());
  });
});
