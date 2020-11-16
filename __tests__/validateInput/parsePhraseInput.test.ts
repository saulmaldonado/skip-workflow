import { config } from '../../src/config';
import { parsePhraseInput } from '../../src/lib/validateInput';

describe('Unit Test: parsePhraseInput', () => {
  const mockPhrase = '/^\\[skip-workflow\\]/gi';
  const oldEnv = { ...process.env };
  const mockEnv = {
    INPUT_PHRASE: mockPhrase,
  };
  beforeAll(() => {
    jest.resetModules();
    process.env = { ...process.env, ...mockEnv };
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should return the expected regex from input', () => {
    const mockRegex = new RegExp(/^\[skip-workflow\]/gi);
    const result = parsePhraseInput(config.PHRASE_INPUT_ID);

    expect(result).toEqual(mockRegex);
  });
});
