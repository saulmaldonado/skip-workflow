import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { debug } from 'console';
import { getPrId } from './getPrId';

export type Commit = { message: string; sha: string };

export type GetCommits = (
  octokit: ReturnType<typeof getOctokit>,
  context: Context,
) => Promise<Commit[]>;

export const getCommits: GetCommits = async (octokit, context) => {
  const { pulls } = octokit;

  const {
    ref,
    repo: { owner, repo },
  } = context;

  const prId = getPrId(ref);

  const { data: commits } = await pulls.listCommits({
    owner,
    pull_number: prId,
    repo,
  });

  return commits.map(({ commit: { message, url }, sha }) => {
    debug(`Found commit sha: ${sha} in pull request: ${prId}. ${url}`);
    return { message, sha };
  });
};
