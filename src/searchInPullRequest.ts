import { debug } from '@actions/core';
import { getPullRequest } from './lib/getPullRequest';
import { SearchIn } from './lib/searchIn';
import { searchPullRequestMessage } from './lib/searchPullRequestMessage';

type SearchInPullRequestResult = {
  result: boolean;
  message?: string;
};

export const searchInPullRequest: SearchIn<SearchInPullRequestResult> = async ({
  context,
  octokit,
  phrase,
}) => {
  const pullRequest = await getPullRequest(octokit, context);

  debug(JSON.stringify({ title: pullRequest.title, body: pullRequest.body }));

  return searchPullRequestMessage(pullRequest, phrase);
};
