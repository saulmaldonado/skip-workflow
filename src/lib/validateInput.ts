import { debug, getInput } from '@actions/core';
import { config } from '../config';
import { removeExtraneousWhiteSpace } from './helpers/removeExtraneousWhiteSpace';

type ValidateInput<T extends keyof typeof config> = (
  inputId: typeof config[T],
) => string | undefined;

export const parsePrMessageOptionInput: ValidateInput<'PR_MESSAGE'> = (
  inputId,
) => {
  const options: Set<string> = new Set(
    ...Object.values(config.PR_MESSAGE_OPTIONS),
  );

  const input = getInput(inputId);

  if (!input) return undefined;

  debug(`${inputId} input: ${input}`);

  const lowerCaseInput = removeExtraneousWhiteSpace(input).toLowerCase();

  if (!options.has(lowerCaseInput)) {
    throw new Error(`${input} is not a valid input for ${inputId}`);
  }

  return lowerCaseInput;
};
