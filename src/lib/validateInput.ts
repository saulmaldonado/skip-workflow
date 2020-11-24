/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/comma-dangle */
import { debug, getInput } from '@actions/core';
import { config } from '../config';
import { convertToRegex } from './helpers/convertToRegex';
import { isRegex } from './helpers/isRegex';
import { removeExtraneousWhiteSpace } from './helpers/removeExtraneousWhiteSpace';

type ValidateInput<
  T extends keyof typeof config,
  R,
  K = Record<string, string>
> = (inputId: typeof config[T], options?: K) => R;

/**
 * Parses and validates 'pr-message' input from workflow and returns the option
 * @param {string} inputId
 * @param {} searchOptions
 */
export const parsePrMessageOptionInput: ValidateInput<
  'PR_MESSAGE',
  string,
  Set<string>
> = (inputId, searchOptions) => {
  const options: Set<string> = new Set(
    Object.values(config.PR_MESSAGE_OPTIONS),
  );

  const input = getInput(inputId);

  if (!input) return config.PR_MESSAGE_OPTIONS.TITLE;

  debug(`${inputId} input: ${input}`);

  if (!searchOptions!.has(config.SEARCH_OPTIONS.PULL_REQUEST)) {
    console.warn(`⚠ Warning: Unnecessary ${config.PR_MESSAGE} input`);
  }

  const lowerCaseInput = removeExtraneousWhiteSpace(input).toLowerCase();

  if (!options.has(lowerCaseInput)) {
    throw new Error(`${input} is not a valid input for ${inputId}`);
  }

  return lowerCaseInput;
};

/**
 * Parses and validates 'phrase' input from workflow and returns the phrase as string or RegExp
 * @param {string} inputId
 *
 * @returns {string | RegExp} phrase string or RegExp
 */
export const parsePhraseInput: ValidateInput<
  'PHRASE_INPUT_ID',
  string | RegExp
> = (inputId) => {
  const phrase = getInput(inputId, { required: true });
  debug(`${inputId} input: ${phrase}`);

  if (isRegex(phrase)) {
    debug(`"${phrase}" detected as RegExp`);
    return convertToRegex(phrase);
  }

  return removeExtraneousWhiteSpace(phrase).toLowerCase();
};

/**
 * Parses and validates 'fail-fast' input from workflow and returns the fail-fast option
 * @param {string} inputId
 *
 * @returns {boolean} fail-fast option
 */
export const parseFailFastInput: ValidateInput<
  'FAIL_FAST_INPUT_ID',
  boolean
> = (inputId) => {
  const failFast = getInput(inputId, { required: true });
  debug(`${inputId} input: ${failFast}`);

  return removeExtraneousWhiteSpace(failFast).toLowerCase() === 'true';
};

/**
 * Parses and validate input from workflow and returns a Set of options found
 * @param {string} inputId JSON string array input from the workflow
 *
 * @returns {Set<string>} Set of options found from input
 */
export const parseSearchInput: ValidateInput<'SEARCH_INPUT_ID', Set<string>> = (
  inputId,
) => {
  const searchInput = getInput(inputId, { required: true });
  debug(`${inputId} input: ${searchInput}`);

  const options: string[] = JSON.parse(searchInput);
  const {
    SEARCH_OPTIONS: { PULL_REQUEST, COMMIT_MESSAGES },
  } = config;
  const searchOptions: string[] = [PULL_REQUEST, COMMIT_MESSAGES];

  const validateOptions = (option: string): string => {
    const lowerCaseOption = option.toLowerCase();

    if (!searchOptions.includes(removeExtraneousWhiteSpace(lowerCaseOption))) {
      throw new Error(`"${option}" is not a valid search option`);
    }
    return lowerCaseOption;
  };

  const validatedOptions = new Set(options.map(validateOptions));

  debug(`options: ${[...validatedOptions].toString()}`);

  return validatedOptions;
};
