import { debug } from 'console';

type GetPrId = (ref: string) => number;

/**
 * Searches for and return the pull request ID from workflow ref
 *
 * @param {string} ref Pull request ref for workflow
 *
 * @returns {number} Pull request ID
 */
export const getPrId: GetPrId = (ref) => {
  const prIdRegex = /(?<=refs\/pull\/)\d+(?=\/merge)/i;

  debug(`Searching for pull request ID in ref: ${ref}`);
  const [prId] = prIdRegex.exec(ref) ?? [];

  if (!prId) {
    throw new Error("Pull request ID was not found, in action's ref.");
  } else if (Number.isNaN(Number(prId))) {
    throw new Error('Invalid pull request ID.');
  }

  return Number(prId);
};
