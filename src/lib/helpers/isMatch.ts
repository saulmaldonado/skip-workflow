import { isRegex } from './isRegex';
import { removeExtraneousWhiteSpace } from './removeExtraneousWhiteSpace';

type IsMatch = (phrase: string | RegExp, string: string) => boolean;

export const isMatch: IsMatch = (phrase, string) => {
  if (isRegex(phrase)) {
    return phrase.test(string);
  }

  const lowercaseString = removeExtraneousWhiteSpace(string).toLowerCase();

  return lowercaseString.includes(phrase);
};
