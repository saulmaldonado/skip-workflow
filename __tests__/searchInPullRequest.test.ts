import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { config } from '../src/config';
import { searchInPullRequest } from '../src/searchInPullRequest';

describe('Unit TestL searchInPullRequest', () => {
  const mockGithubToken = 'githubToken';
  const mockOctokit = getOctokit(mockGithubToken);
  const mockPhrase = 'docs';

  let oldEnv: typeof process.env;

  beforeAll(() => {
    oldEnv = { ...process.env };
    jest.resetModules();

    process.env.GITHUB_EVENT_NAME = config.PUSH_EVENT_NAME;
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should not call api and should return an undefined result and message when ref matches with "refs/heads/main"', async () => {
    const mockContext = new Context();

    const result = await searchInPullRequest(
      mockOctokit,
      mockContext,
      mockPhrase,
    );

    expect(result).toEqual({ result: undefined, message: undefined });
  });

  it('should not call api and should return an undefined result and message when ref matches with "refs/heads/master"', async () => {
    const mockContext = new Context();

    const result = await searchInPullRequest(
      mockOctokit,
      mockContext,
      mockPhrase,
    );

    expect(result).toEqual({ result: undefined, message: undefined });
  });
});
