import { config } from '../config';
import { removeExtraneousWhiteSpace } from './helpers/removeExtraneousWhiteSpace';

type ParseSearchInput = (searchInput: string) => Set<string>;

/**
 * Parses input from workflow and outputs a Set of options found
 * @param {string} searchInput JSON string array input from the workflow
 *
 * @returns {Set<string>} Set of options found from input
 */
export const parseSearchInput: ParseSearchInput = (searchInput) => {
  const options: string[] = JSON.parse(searchInput);
  const {
    SEARCH_OPTIONS: { PULL_REQUEST, COMMIT_MESSAGES },
  } = config;
  const searchOptions = [PULL_REQUEST, COMMIT_MESSAGES];

  const findOption = (option: string): string => {
    const lowerCaseOption = option.toLowerCase();

    if (!searchOptions.includes(removeExtraneousWhiteSpace(lowerCaseOption))) {
      throw new Error(`"${option}" is not a valid search option`);
    }
    return lowerCaseOption;
  };

  return new Set(options.map(findOption));
};
