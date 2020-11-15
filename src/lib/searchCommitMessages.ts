import { debug } from 'console';
import { Commit } from './getCommits';
import { removeExtraneousWhiteSpace } from './helpers/removeExtraneousWhiteSpace';

export type SearchCommitMessagesResult =
  | { result: true; commit: undefined }
  | { result: false; commit: Commit };

type SearchCommitMessages = (
  commits: Commit[],
  phrase: string,
) => SearchCommitMessagesResult;

/**
 * Searches all commits for message with included matching phrase. Case and whitespace insensitive.
 * @param {{message: string, sha: string}} commits Array of commits
 * @param {string} phrase Phrase to match
 *
 * @returns {{ result: true; commit: undefined } | { result: false; commit: Commit }}
 * object with result and commit that does not match the phrase
 */
export const searchAllCommitMessages: SearchCommitMessages = (
  commits,
  phrase,
) => {
  const commit = commits.find(({ message, sha }) => {
    const lowercaseMessage = removeExtraneousWhiteSpace(message).toLowerCase();

    debug(`Searching for "${phrase}" in "${message}" sha: ${sha}`);

    return !lowercaseMessage.includes(phrase);
  });

  const result = !commit;

  if (result) {
    return { result, commit: undefined };
  }

  return { result, commit: commit! };
};
