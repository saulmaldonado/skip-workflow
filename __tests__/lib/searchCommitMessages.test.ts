import { searchAllCommitMessages } from '../../src/lib/searchCommitMessages';

describe('Unit Test: searchCommitMessages', () => {
  const mockPhrase = 'docs';

  it('should return result of true and no commit when all commit messages match with phrase', () => {
    const mockCommits = [
      { message: 'docs: add docs', sha: '123456' },
      { message: 'docs: edit docs', sha: '456789' },
    ];

    const result = searchAllCommitMessages(mockCommits, mockPhrase);

    expect(result).toEqual({ result: true, commit: undefined });
  });

  it('should return result of false and first commit when not all commit messages match with phrase', () => {
    const mockCommits = [
      { message: 'fix: fix code', sha: '123456' },
      { message: 'fix: fix more code', sha: '456789' },
    ];

    const result = searchAllCommitMessages(mockCommits, mockPhrase);

    expect(result).toEqual({
      result: false,
      commit: { message: 'fix: fix code', sha: '123456' },
    });
  });
});
