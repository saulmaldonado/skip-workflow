import { convertToRegex } from '../../../src/lib/helpers/convertToRegex';

describe('Unit Test: convertToRegex', () => {
  it('should convert valid string to RegExp', () => {
    const mockPhrase = '/^\\[skip-workflow\\]/gi';
    const result = convertToRegex(mockPhrase);

    expect(result).toBeTruthy();
  });

  it('should return the expected RegExp for a given RegExp string', () => {
    const mockRegex = new RegExp(/^\[skip-workflow\]/, 'gi');
    const mockPhrase = '/^\\[skip-workflow\\]/gi';

    const result = convertToRegex(mockPhrase);

    expect(result).toEqual(mockRegex);
  });

  it('should throw when give an invalid regex string', () => {
    const mockPhrase = '/[/gi';

    expect(() => {
      convertToRegex(mockPhrase);
    }).toThrow();
  });
});
