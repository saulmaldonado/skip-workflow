import { removeExtraneousWhiteSpace } from './removeExtraneousWhiteSpace';

type IsMatch = (phrase: string | RegExp, string: string) => boolean;

export const isMatch: IsMatch = (phrase, string) => {
  if (phrase instanceof RegExp) {
    return phrase.test(string);
  }

  const lowercaseString = removeExtraneousWhiteSpace(string).toLowerCase();

  return lowercaseString.includes(phrase);
};
