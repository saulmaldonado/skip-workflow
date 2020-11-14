import { debug } from '@actions/core';
import { PullsGetResponseData } from '@octokit/types';

type SearchPullRequestMessage = (
  pullRequest: PullsGetResponseData,
  phrase: string,
  options?: SearchPullRequestMessageOptions,
) => SearchPullRequestMessageResult;

type SearchPullRequestMessageResult =
  | { result: true; message: undefined }
  | { result: false; message: string };

type SearchPullRequestMessageOptions = {
  textToSearch: 'title' | 'body' | 'title & body';
};

/**
 *
 * @param {PullsGetResponseData} pullRequest Pull request object
 * @param {string} phrase phrase to search
 * @param {SearchPullRequestMessageOptions} options options
 *
 * @returns {SearchPullRequestMessageResult} result object with search result
 * and message is applicable
 */
export const searchPullRequestMessage: SearchPullRequestMessage = (
  { title, body },
  phrase,
  { textToSearch } = { textToSearch: 'title' },
) => {
  let message = '';
  if (textToSearch === 'title' || textToSearch === 'title & body') {
    debug(`Searching for ${phrase} in title`);
    message += !title.includes(phrase) ? title : '';
  }

  if (textToSearch === 'body' || textToSearch === 'title & body') {
    debug(`Searching for ${phrase} in body`);
    message += !body.includes(phrase) ? ' & body' : '';
  }

  message = message.replace(/^( & )/i, '');

  const result = !message;

  if (result) {
    return { result, message: undefined };
  }

  return { result, message };
};
