import { getInput, debug } from '@actions/core';
import { config } from '../config';

type GetPrId = (ref: string) => number;

/**
 * Searches for and return the pull request ID from workflow ref
 *
 * @param {string} ref Pull request ref for workflow
 *
 * @returns {number} Pull request ID
 */
export const getPrId: GetPrId = (ref) => {
  const { PR_ID_INPUT_ID } = config;
  const prIdRegex = /(?<=refs\/pull\/)[\d\w]+(?=\/merge)/i;

  let prId = getInput(PR_ID_INPUT_ID);

  if (!prId) {
    debug(`Searching for pull request ID in ref: ${ref}`);
    [prId] = prIdRegex.exec(ref) ?? [];
  }

  if (!prId) {
    throw new Error("Pull request ID was not found, in action's ref.");
  } else if (Number.isNaN(Number(prId))) {
    throw new Error(`Invalid pull request ID: ${prId}`);
  } else if (prId.startsWith('0')) {
    throw new Error(`Invalid pull request ID: ${prId}`);
  }

  return Number(prId);
};
