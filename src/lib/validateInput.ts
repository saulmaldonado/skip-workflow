import { debug, getInput } from '@actions/core';
import { config } from '../config';
import { convertToRegex } from './helpers/convertToRegex';
import { isRegex } from './helpers/isRegex';
import { removeExtraneousWhiteSpace } from './helpers/removeExtraneousWhiteSpace';

type ValidateInput<T extends keyof typeof config> = (
  inputId: typeof config[T],
) => string;

type ValidateInputRegex<T extends keyof typeof config> = (
  inputId: typeof config[T],
) => string | RegExp;

export const parsePrMessageOptionInput: ValidateInput<'PR_MESSAGE'> = (
  inputId,
) => {
  const options: Set<string> = new Set(
    Object.values(config.PR_MESSAGE_OPTIONS),
  );

  const input = getInput(inputId);

  if (!input) return config.PR_MESSAGE_OPTIONS.TITLE;

  debug(`${inputId} input: ${input}`);

  const lowerCaseInput = removeExtraneousWhiteSpace(input).toLowerCase();

  if (!options.has(lowerCaseInput)) {
    throw new Error(`${input} is not a valid input for ${inputId}`);
  }

  return lowerCaseInput;
};

export const parsePhraseInput: ValidateInputRegex<'PHRASE_INPUT_ID'> = (
  inputId,
) => {
  const phrase = getInput(inputId, { required: true });
  debug(`${inputId} input: ${phrase}`);

  if (isRegex(phrase)) {
    return convertToRegex(phrase);
  }

  return removeExtraneousWhiteSpace(phrase).toLowerCase();
};
