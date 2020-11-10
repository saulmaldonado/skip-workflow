/* eslint-disable @typescript-eslint/indent */
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { getCommits } from '../../src/lib/getCommits';

describe('Unit Test: getCommits', () => {
  const mockGithubToken = 'githubToken';

  const mockRepo = 'skip-workflow';
  const mockOwner = 'github-action';

  const octokit = getOctokit(mockGithubToken);

  let mockContext: Context;

  let listCommitsSpy: jest.SpyInstance<
    unknown,
    Parameters<typeof octokit['pulls']['listCommits']>
  >;
  const mockCommits = [
    {
      commit: { message: 'message1', url: 'https://example.com' },
      sha: '123456',
    },
    {
      commit: { message: 'message2', url: 'https://example.com' },
      sha: '456789',
    },
  ];

  const mockPrId = 1;
  const mockRef = `refs/pull/${mockPrId}/merge`;

  beforeAll(async () => {
    jest.resetModules();
    process.env.GITHUB_REF = mockRef;
    process.env.GITHUB_REPOSITORY = `${mockOwner}/${mockRepo}`;

    mockContext = (await import('@actions/github')).context; // workflow context is instantiated on import

    listCommitsSpy = jest.spyOn(octokit.pulls, 'listCommits');

    listCommitsSpy.mockImplementation(() => ({ data: mockCommits }));
  });

  afterAll(() => {
    jest.clearAllMocks();

    delete process.env.GITHUB_REF;
    delete process.env.GITHUB_REPOSITORY;
  });

  it('should return expected commits', async () => {
    const mockCommitsResult = [
      { message: 'message1', sha: '123456' },
      { message: 'message2', sha: '456789' },
    ];

    const result = await getCommits(octokit, mockContext);

    expect(result).toEqual(mockCommitsResult);
  });

  it('should call listCommits methods with the expected options', async () => {
    await getCommits(octokit, mockContext);

    expect(listCommitsSpy).toBeCalledWith({
      owner: mockOwner,
      repo: mockRepo,
      pull_number: mockPrId,
    });
  });
});