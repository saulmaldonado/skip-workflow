import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { PullsGetResponseData } from '@octokit/types';
import { getPrId } from './getPrId';

type GetPullRequest = (
  octokit: ReturnType<typeof getOctokit>,
  context: Context,
) => Promise<PullsGetResponseData>;

let pullRequestCache: PullsGetResponseData;

export const getPullRequest: GetPullRequest = async (octokit, context) => {
  if (pullRequestCache) return pullRequestCache;

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

  pullRequestCache = pr;

  return pr;
};
