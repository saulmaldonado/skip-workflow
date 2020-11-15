import { PullsGetResponseData } from '@octokit/types';
import { searchPullRequestMessage } from '../../src/lib/searchPullRequestMessage';

describe('Unit Test: searchPullRequestMessage', () => {
  const mockPhrase = 'docs';

  describe('Matches:', () => {
    const mockTitle = 'docs: edit docs';
    const mockBody = `
  Edits docs
  `;

    it('should return result of true and no message when the title matches with phrase', () => {
      const result = searchPullRequestMessage(
        {
          title: mockTitle,
          body: mockBody,
        } as PullsGetResponseData,
        mockPhrase,
        { textToSearch: 'title' },
      );

      expect(result).toEqual({ result: true, message: undefined });
    });

    it('should return result of true and no message when the body matches with phrase', () => {
      const result = searchPullRequestMessage(
        {
          title: mockTitle,
          body: mockBody,
        } as PullsGetResponseData,
        mockPhrase,
        { textToSearch: 'body' },
      );

      expect(result).toEqual({ result: true, message: undefined });
    });

    it('should return result of true and no message when the title and body matches with phrase', () => {
      const result = searchPullRequestMessage(
        {
          title: mockTitle,
          body: mockBody,
        } as PullsGetResponseData,
        mockPhrase,
        { textToSearch: 'title & body' },
      );

      expect(result).toEqual({ result: true, message: undefined });
    });
  });

  describe('NonMatches: ', () => {
    const badMockTitle = 'fix: edit code';
    const badMockBody = `
    Edits code
    `;

    it('should return result of false and title as message when title does not match with phrase', () => {
      const result = searchPullRequestMessage(
        {
          title: badMockTitle,
          body: badMockBody,
        } as PullsGetResponseData,
        mockPhrase,
      );

      expect(result).toEqual({
        result: false,
        message: badMockTitle,
      });
    });

    it('should return result of false and body as message when body does not match with phrase', () => {
      const result = searchPullRequestMessage(
        {
          title: badMockTitle,
          body: badMockBody,
        } as PullsGetResponseData,
        mockPhrase,
        { textToSearch: 'body' },
      );

      const mockMessage = 'body';

      expect(result).toEqual({ result: false, message: mockMessage });
    });

    it('should return result of false and title & body as message when they neither match with phrase', () => {
      const result = searchPullRequestMessage(
        {
          title: badMockTitle,
          body: badMockBody,
        } as PullsGetResponseData,
        mockPhrase,
        { textToSearch: 'title & body' },
      );

      const mockMessage = `${badMockTitle} & body`;

      expect(result).toEqual({ result: false, message: mockMessage });
    });
  });
});
