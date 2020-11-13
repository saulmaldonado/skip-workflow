import { removeExtraneousWhiteSpace } from '../../../src/lib/helpers/removeExtraneousWhiteSpace';

describe('Unit Test: removeExtraneousWhiteSpace', () => {
  it('should remove extra whitespace from string', () => {
    const inputString = '   hello   world   ';
    const expectedString = 'hello world';

    const result = removeExtraneousWhiteSpace(inputString);

    expect(result).toBe(expectedString);
  });
});
