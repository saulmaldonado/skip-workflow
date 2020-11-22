import { removeExtraneousWhiteSpace } from './removeExtraneousWhiteSpace';

type IsMatch = (phrase: string | RegExp, string: string) => boolean;

export const isMatch: IsMatch = (phrase, string) => {
  if (phrase instanceof RegExp) {
    /* RegExp copy prevents g flag from storing lastIndex between test */
    const regexCopy = new RegExp(phrase);
    return regexCopy.test(string);
  }

  const lowercaseString = removeExtraneousWhiteSpace(string).toLowerCase();

  return lowercaseString.includes(phrase);
};
