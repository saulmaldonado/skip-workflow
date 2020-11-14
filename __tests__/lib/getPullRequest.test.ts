import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { PullsGetResponseData } from '@octokit/types';
import { getPullRequest, pullRequestCache } from '../../src/lib/getPullRequest';

describe('Unit Test: getPullRequest', () => {
  const mockGithubToken = 'githubToken';
  const mockRepo = 'skip-workflow';
  const mockOwner = 'github-action';
  const mockPrId = 1;
  const mockRef = `refs/pull/${mockPrId}/merge`;

  const mockEnv = {
    GITHUB_REPOSITORY: `${mockOwner}/${mockRepo}`,
    GITHUB_REF: mockRef,
  };

  const oldEnv = { ...process.env };

  const octokit = getOctokit(mockGithubToken);

  let getPullRequestSpy: jest.SpyInstance;
  const getPullRequestMock = jest.fn(() => ({
    data: ['mock-response'],
  }));

  let context: Context;

  beforeAll(() => {
    jest.resetModules();

    getPullRequestSpy = jest.spyOn(octokit.pulls, 'get');
    getPullRequestSpy.mockImplementation(getPullRequestMock);

    process.env = { ...process.env, ...mockEnv };

    context = new Context();
  });

  afterEach(() => {
    pullRequestCache.cache = null;
  });

  afterAll(() => {
    jest.resetAllMocks();

    process.env = oldEnv;
  });

  it('should request PR with correct arguments', async () => {
    await getPullRequest(octokit, context);

    expect(getPullRequestMock).toBeCalledWith({
      owner: mockOwner,
      repo: mockRepo,
      pull_number: mockPrId,
    });
  });

  it('should set cache when request is made', async () => {
    const result = await getPullRequest(octokit, context);

    expect(pullRequestCache?.cache).toEqual(result);
  });

  it('should return cache and not call api when cache is set', async () => {
    pullRequestCache.cache = ([
      'mock-response',
    ] as unknown) as PullsGetResponseData;
    getPullRequestSpy.mockClear();

    const result = await getPullRequest(octokit, context);

    expect(pullRequestCache?.cache).toEqual(result);
    expect(getPullRequestSpy).not.toHaveBeenCalled();
  });
});
