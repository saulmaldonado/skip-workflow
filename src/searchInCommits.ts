import { Commit, getCommits } from './lib/getCommits';
import { searchAllCommitMessages } from './lib/searchCommitMessages';
import { SearchIn } from './lib/searchIn';

type SearchInCommitsResult = {
  result: boolean;
  commit?: Commit;
};

type SearchInCommits = SearchIn<SearchInCommitsResult>;

export const searchInCommits: SearchInCommits = async ({
  context,
  octokit,
  phrase,
}) => {
  const commits = await getCommits(octokit, context);

  return searchAllCommitMessages(commits, phrase);
};
