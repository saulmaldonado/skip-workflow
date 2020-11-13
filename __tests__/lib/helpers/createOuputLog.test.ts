import {
  createOutputFoundLog,
  createOutputNotFoundLog,
} from '../../../src/lib/helpers/createOuputLog';

describe('Unit Test: createOutputLog', () => {
  const mockPhrase = 'docs';

  describe('createOutputFoundLog', () => {
    it('should output the expected log for workflows to be skipped searched by commits_messages', () => {
      const mockCommitMessagesSearchResult = true;

      const log = createOutputFoundLog({
        phrase: mockPhrase,
        commitMessagesSearchResult: mockCommitMessagesSearchResult,
      });

      const expectedLog = `⏭ "${mockPhrase}" found in: all commit messages. skipping workflow...`;

      expect(log).toBe(expectedLog);
    });

    it('should output the expected log for workflows to be skipped searched by pull_request', () => {
      const mockTitleSearchResult = true;

      const log = createOutputFoundLog({
        phrase: mockPhrase,
        titleSearchResult: mockTitleSearchResult,
      });

      const expectedLog = `⏭ "${mockPhrase}" found in: title. skipping workflow...`;

      expect(log).toBe(expectedLog);
    });

    it('should output the expected log for workflows to be skipped searched by commits_messages and pull_request', () => {
      const mockCommitMessagesSearchResult = true;
      const mockTitleSearchResult = true;

      const log = createOutputFoundLog({
        phrase: mockPhrase,
        commitMessagesSearchResult: mockCommitMessagesSearchResult,
        titleSearchResult: mockTitleSearchResult,
      });

      const expectedLog = `⏭ "${mockPhrase}" found in: all commit messages & title. skipping workflow...`;

      expect(log).toBe(expectedLog);
    });
  });

  describe('createOutputNotFoundLog', () => {
    const mockCommit = { message: 'sample-commit-message', sha: '123456' };
    const mockTitleMessage = 'sample-pr-title';

    it('should output the expected log for workflows to not be skipped by commit_messages', () => {
      const log = createOutputNotFoundLog({
        phrase: mockPhrase,
        commitMessagesSearchResult: false,
        commit: mockCommit,
      });

      const expectedLog = `❗ "${mockPhrase}" not found in: commit message: sample-commit-message sha: 123456. continuing workflow...`;

      expect(log).toBe(expectedLog);
    });

    it('should output the expected log for workflows to not be skipped by pull_request', () => {
      const log = createOutputNotFoundLog({
        phrase: mockPhrase,
        titleSearchResult: false,
        message: mockTitleMessage,
      });

      const expectedLog = `❗ "${mockPhrase}" not found in: pull request title: sample-pr-title. continuing workflow...`;

      expect(log).toBe(expectedLog);
    });

    it('should output the expected log for workflows to not be skipped by commit_message and pull_request', () => {
      const log = createOutputNotFoundLog({
        phrase: mockPhrase,
        titleSearchResult: false,
        message: mockTitleMessage,
        commitMessagesSearchResult: false,
        commit: mockCommit,
      });

      const expectedLog = `❗ "${mockPhrase}" not found in: commit message: sample-commit-message sha: 123456 & pull request title: sample-pr-title. continuing workflow...`;

      expect(log).toBe(expectedLog);
    });
  });
});
