import { config } from '../../src/config';
import { parseSearchInput } from '../../src/lib/validateInput';

describe('Unit Test: parseSearchInput', () => {
  const {
    SEARCH_OPTIONS: { COMMIT_MESSAGES, PULL_REQUEST },
    SEARCH_INPUT_ID,
  } = config;

  const searchInputEnv = 'INPUT_SEARCH';

  let oldEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    jest.resetModules();
    oldEnv = process.env;
  });

  beforeEach(() => {
    process.env = { ...oldEnv };
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should output expected Set of options', () => {
    const expectedOptions = new Set([COMMIT_MESSAGES, PULL_REQUEST]);
    const mockSearchOptionsInput = `["${COMMIT_MESSAGES}", "${PULL_REQUEST}"]`;

    process.env[searchInputEnv] = mockSearchOptionsInput;

    const result = parseSearchInput(SEARCH_INPUT_ID);

    expect(result).toEqual(expectedOptions);
  });

  it('should output expected Set of options when input is of different casing', () => {
    const mockInputUpperCase = `["${COMMIT_MESSAGES.toUpperCase()}", "${PULL_REQUEST.toUpperCase()}"]`;
    const expectedOptions = new Set([COMMIT_MESSAGES, PULL_REQUEST]);

    process.env[searchInputEnv] = mockInputUpperCase;

    const result = parseSearchInput(SEARCH_INPUT_ID);
    expect(result).toEqual(expectedOptions);
  });

  it('should fail on invalid search options input', () => {
    const invalidInput = JSON.stringify(['commit-messages', 'pull-request']);

    process.env[searchInputEnv] = invalidInput;

    expect(() => {
      parseSearchInput(SEARCH_INPUT_ID);
    }).toThrow();
  });
});
