import { isMatch } from '../../../src/lib/helpers/isMatch';

describe('Unit Test: isMatch', () => {
  it('should return true for successfully matching phrase with string', () => {
    const mockString = '[skip-workflow]: edit docs';
    const mockPhrase = '[skip-workflow]';
    const result = isMatch(mockPhrase, mockString);

    expect(result).toBe(true);
  });

  it('should return false for non matching phrase with string', () => {
    const mockString = 'fix: fix code';
    const mockPhrase = '[skip-workflow]';
    const result = isMatch(mockPhrase, mockString);

    expect(result).toBe(false);
  });

  it('should return true for successfully matching regex with string', () => {
    const mockString = '[skip-workflow]: edit docs';
    const mockRegex = new RegExp('^\\[skip-workflow\\]', 'gi');
    const result = isMatch(mockRegex, mockString);

    expect(result).toBe(true);
  });

  it('should return true for successfully matching phrase with string', () => {
    const mockString = '[skip-workflow]: edit docs';
    const mockRegex = new RegExp('/^helloWorld/', 'gi');
    const result = isMatch(mockRegex, mockString);

    expect(result).toBe(false);
  });
});
