import { config } from '../../src/config';
import { parseSearchInput } from '../../src/lib/parseSearchInput';

describe('Unit Test: parseSearchInput', () => {
  const { COMMIT_MESSAGES, PULL_REQUEST } = config.SEARCH_OPTIONS;
  const mockInput = `["${COMMIT_MESSAGES}", "${PULL_REQUEST}"]`;

  it('should output expected Set of options', () => {
    const expectedOptions = new Set([COMMIT_MESSAGES, PULL_REQUEST]);

    const result = parseSearchInput(mockInput);

    expect(result).toEqual(expectedOptions);
  });

  it('should output expected Set of options when input is of different casing', () => {
    const mockInputUpperCase = `["${COMMIT_MESSAGES.toUpperCase()}", "${PULL_REQUEST.toUpperCase()}"]`;
    const expectedOptions = new Set([COMMIT_MESSAGES, PULL_REQUEST]);

    const result = parseSearchInput(mockInputUpperCase);
    expect(result).toEqual(expectedOptions);
  });

  it('should fail on invalid search options input', () => {
    const invalidInput = JSON.stringify(['commit-messages', 'pull-request']);

    expect(() => {
      parseSearchInput(invalidInput);
    }).toThrow();
  });
});
