import { debug } from '@actions/core';
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { ReposListCommitsResponseData } from '@octokit/types';
import { getPrId } from './getPrId';
import { config } from '../config';

export type Commit = { message: string; sha: string };

export type GetCommits = (
  octokit: ReturnType<typeof getOctokit>,
  context: Context,
) => Promise<Commit[]>;

/**
 * fetches all commits for pull request or push event
 * @param {octokit} octokit Octokit instance
 * @param {Context} context workflow context instance
 *
 * @returns {Promise<{message: string, sha: string}[]>} Promise if commit messages and shas array
 */
export const getCommits: GetCommits = async (octokit, context) => {
  const { pulls, repos } = octokit;

  const {
    ref,
    repo: { owner, repo },
    eventName,
  } = context;

  if (eventName === config.PUSH_EVENT_NAME) {
    const {
      payload: { before }, // The SHA of the most recent commit on ref before the push.
    } = context;

    const { data } = await repos.listCommits({
      owner,
      repo,
    });

    const commits: ReposListCommitsResponseData = [];

    data.every((commit) => {
      if (commit.sha === before) {
        return false;
      }
      commits.push(commit);
      return true;
    });

    return commits.map(({ commit: { message, url }, sha }) => {
      debug(`Found commit sha: ${sha} in push. ${url}`);
      return { message, sha };
    });
  }

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
