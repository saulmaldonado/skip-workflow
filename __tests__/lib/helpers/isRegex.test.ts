import { isRegex } from '../../../src/lib/helpers/isRegex';

describe('Unit Test: isRegex', () => {
  it('should return true for a regex', () => {
    const mockRegex = '/Hello World/gi';

    const result = isRegex(mockRegex);

    expect(result).toBe(true);
  });

  it('should return false for a regular string', () => {
    const mockString = 'Hello World';

    const result = isRegex(mockString);

    expect(result).toBe(false);
  });
});
