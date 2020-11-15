import * as github from '@actions/github';
import * as command from '@actions/core/lib/command';
import * as core from '@actions/core';
import run from '../src/run';
import { config } from '../src/config';
import { pullRequestCache } from '../src/lib/getPullRequest';

describe('Integration Test: main', () => {
  const mockGithubToken = 'githubToken';
  const mockRepo = 'skip-workflow';
  const mockOwner = 'github-action';
  const mockPhrase = 'docs';
  const mockPrId = 1;
  const mockRef = `refs/pull/${mockPrId}/merge`;

  const mockEnv = {
    GITHUB_REF: mockRef,
    GITHUB_REPOSITORY: `${mockOwner}/${mockRepo}`,
    'INPUT_GITHUB-TOKEN': mockGithubToken,
    INPUT_PHRASE: mockPhrase,
    GITHUB_EVENT_NAME: 'pull_request',
  };

  const oldEnv = { ...process.env };

  const mockOctokit = github.getOctokit(mockGithubToken);

  let listCommitsSpy: jest.SpyInstance;
  let getOctokitSpy: jest.SpyInstance;
  let issueCommandSpy: jest.SpyInstance;
  let setFailedSpy: jest.SpyInstance;
  let getCommitSpy: jest.SpyInstance;
  let getPullRequestSpy: jest.SpyInstance;

  beforeAll(async () => {
    jest.resetModules();

    process.env = { ...process.env, ...mockEnv };

    getOctokitSpy = jest.spyOn(github, 'getOctokit');
    getOctokitSpy.mockImplementation(() => mockOctokit);

    listCommitsSpy = jest.spyOn(mockOctokit.pulls, 'listCommits');

    getCommitSpy = jest.spyOn(mockOctokit.pulls, 'get');
    getCommitSpy.mockImplementation(() => ['mock commits here']);

    issueCommandSpy = jest.spyOn(command, 'issueCommand');
    setFailedSpy = jest.spyOn(core, 'setFailed');

    getPullRequestSpy = jest.spyOn(mockOctokit.pulls, 'get');
  });

  afterAll(() => {
    jest.clearAllMocks();
    process.env = oldEnv;
  });

  describe('Search in: commit_messages', () => {
    beforeAll(() => {
      process.env.INPUT_SEARCH = JSON.stringify(['commit_messages']);
    });

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

      const mockFn = jest.fn();
      setFailedSpy.mockImplementationOnce(mockFn);

      await run();

      expect(setFailedSpy).toBeCalledWith(mockNetworkError);
    });
  });

  describe('Search in: pull_request', () => {
    beforeAll(() => {
      process.env.INPUT_SEARCH = JSON.stringify(['pull_request']);
    });

    it('should set output to true when pull request title matches', async () => {
      const mockTitle = 'docs: edit docs';
      const mockBody = `
    Edits docs
    `;

      getPullRequestSpy.mockImplementationOnce(() => ({
        data: {
          title: mockTitle,
          body: mockBody,
        },
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

    it('should set output to null when pull request title does not match', async () => {
      const mockTitle = 'fix: fix code';
      const mockBody = `
    Fix code
    `;

      getPullRequestSpy.mockImplementationOnce(() => ({
        data: {
          title: mockTitle,
          body: mockBody,
        },
      }));

      pullRequestCache.cache = null;

      await run();

      expect(issueCommandSpy).toBeCalledWith(
        'set-output',
        {
          name: config.MATCH_FOUND_OUTPUT_ID,
        },
        null,
      );
    });
  });
});
