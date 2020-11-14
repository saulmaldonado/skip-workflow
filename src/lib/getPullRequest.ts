import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { PullsGetResponseData } from '@octokit/types';
import { getPrId } from './getPrId';

type GetPullRequest = (
  octokit: ReturnType<typeof getOctokit>,
  context: Context,
) => Promise<PullsGetResponseData>;

export type PullRequestCache = { cache: PullsGetResponseData | null };

export const pullRequestCache: PullRequestCache = {
  cache: null,
};

/**
 * Requests pull request object from github API
 * @param {Octokit} octokit
 * @param {Context} context
 *
 * @returns {PullsGetResponseData} pull request object
 */
export const getPullRequest: GetPullRequest = async (octokit, context) => {
  if (pullRequestCache?.cache) return pullRequestCache.cache;

  const {
    repo: { owner, repo },
    ref,
  } = context;

  const { pulls } = octokit;

  const prId = getPrId(ref);

  const { data: pr } = await pulls.get({
    owner,
    repo,
    pull_number: prId,
  });

  pullRequestCache.cache = pr;

  return pr;
};
