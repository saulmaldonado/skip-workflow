import { config } from '../../src/config';
import { parsePrMessageOptionInput } from '../../src/lib/validateInput';

describe('Unit Test: parsePrMessageOptionInput', () => {
  const mockPrMessageInput = 'title & body';

  const oldEnv = { ...process.env };
  const mockEnv = {
    'INPUT_PR-MESSAGE': 'title & body',
  };
  beforeAll(() => {
    jest.resetModules();

    process.env = { ...process.env, ...mockEnv };
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should validate and return the input from the workflow', () => {
    const result = parsePrMessageOptionInput(config.PR_MESSAGE);

    expect(result).toBe(mockPrMessageInput);
  });

  it('should throw an error if input does not match one of the options', () => {
    process.env['INPUT_PR-MESSAGE'] = 'title and body';
    expect(() => {
      parsePrMessageOptionInput(config.PR_MESSAGE);
    }).toThrow();
  });

  it('should return default if input is empty', () => {
    delete process.env['INPUT_PR-MESSAGE'];
    const result = parsePrMessageOptionInput(config.PR_MESSAGE);

    expect(result).toBe(config.PR_MESSAGE_OPTIONS.TITLE);
  });
});
