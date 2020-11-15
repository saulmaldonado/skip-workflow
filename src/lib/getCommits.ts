import { debug } from '@actions/core';
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { getPrId } from './getPrId';
import { config } from '../config';

export type Commit = { message: string; sha: string };

export type GetCommits = (
  octokit: ReturnType<typeof getOctokit>,
  context: Context,
) => Promise<Commit[]>;

/**
 *
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
      data: {
        sha,
        commit: { message },
        url,
      },
    } = await repos.getCommit({
      owner,
      repo,
      ref,
    });

    debug(`Found commit sha: ${sha}. ${url}`);

    return [{ message, sha }];
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
