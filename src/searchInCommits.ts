import { Commit, getCommits } from './lib/getCommits';
import { searchAllCommitMessages } from './lib/searchCommitMessages';
import { SearchIn } from './lib/searchIn';

type SearchInCommitsResult = {
  result: boolean;
  commit?: Commit;
};

type SearchInCommits = SearchIn<SearchInCommitsResult>;

/**
 * @param {Context} args.context workflow context
 * @param {Octokit} args.octokit octokit instance for workflow
 * @param {string} args.phrase phrase to search for
 *
 * @returns {{ result: boolean, commit?: Commit }} results object from the search
 */
export const searchInCommits: SearchInCommits = async (
  octokit,
  context,
  phrase,
) => {
  const commits = await getCommits(octokit, context);

  return searchAllCommitMessages(commits, phrase);
};
