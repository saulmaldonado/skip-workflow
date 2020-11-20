import { config } from '../../src/config';
import { parsePrMessageOptionInput } from '../../src/lib/validateInput';

describe('Unit Test: parsePrMessageOptionInput', () => {
  const mockPrMessageInput = 'title & body';

  const searchOptions = new Set(['commit_messages', 'pull_request']);

  const oldEnv = { ...process.env };
  const mockEnv = {
    'INPUT_PR-MESSAGE': 'title & body',
  };
  beforeAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();

    process.env = { ...process.env, ...mockEnv };
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should validate and return the input from the workflow', () => {
    const result = parsePrMessageOptionInput(config.PR_MESSAGE, searchOptions);

    expect(result).toBe(mockPrMessageInput);
  });

  it('should throw an error if input does not match one of the options', () => {
    process.env['INPUT_PR-MESSAGE'] = 'title and body'; // misspelled option
    expect(() => {
      parsePrMessageOptionInput(config.PR_MESSAGE, searchOptions);
    }).toThrow();
  });

  it('should return default if input is empty', () => {
    delete process.env['INPUT_PR-MESSAGE'];
    const result = parsePrMessageOptionInput(config.PR_MESSAGE, searchOptions);

    expect(result).toBe(config.PR_MESSAGE_OPTIONS.TITLE);
  });

  it('should log warning when pr-message input is present and search options does not include "pull_request"', () => {
    process.env['INPUT_PR-MESSAGE'] = mockPrMessageInput;

    const consoleLogSpy = jest.spyOn(console, 'warn');

    const mockSearchOptions = new Set(['commit_messages']);

    parsePrMessageOptionInput(config.PR_MESSAGE, mockSearchOptions);

    expect(consoleLogSpy).toBeCalled();
  });
});
