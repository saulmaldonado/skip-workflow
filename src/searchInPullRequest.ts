import { debug } from '@actions/core';
import { getPullRequest } from './lib/getPullRequest';
import { isPushToMain } from './lib/helpers/isPushToMain';
import { SearchIn } from './lib/searchIn';
import { searchPullRequestMessage } from './lib/searchPullRequestMessage';

type SearchInPullRequestResult = {
  result?: boolean;
  message?: string;
};

/**
 * @param {Context} args.context workflow context
 * @param {Octokit} args.octokit octokit instance for workflow
 * @param {string} args.phrase phrase to search for
 *
 * @returns {{ result: boolean, commit?: Commit }} results object from the search
 */
export const searchInPullRequest: SearchIn<SearchInPullRequestResult> = async (
  octokit,
  context,
  phrase,
) => {
  const { ref } = context;
  if (isPushToMain(ref)) {
    return { result: undefined, message: undefined };
  }

  const pullRequest = await getPullRequest(octokit, context);

  debug(JSON.stringify({ title: pullRequest.title, body: pullRequest.body }));

  return searchPullRequestMessage(pullRequest, phrase);
};
