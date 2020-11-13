import { Commit } from '../getCommits';

type CreateOutputLogParameters = {
  commitMessagesSearchResult?: boolean;
  titleSearchResult?: boolean;
  message?: string;
  phrase: string;
};

type CreateOutputFoundLog = (args: CreateOutputLogParameters) => string;

type CreateOutputNotFoundLog = (
  args: CreateOutputLogParameters & {
    commit?: Commit;
  },
) => string;

const leadingAmpersandRegex = /^( & )/;

export const createOutputFoundLog: CreateOutputFoundLog = ({
  commitMessagesSearchResult,
  titleSearchResult,
  message = 'title',
  phrase,
}) => {
  let log = '';
  log += commitMessagesSearchResult ? 'all commit messages' : '';
  log += titleSearchResult ? ` & ${message}` : '';
  log = log.replace(leadingAmpersandRegex, '');

  return `⏭ "${phrase}" found in: ${log}. skipping workflow...`;
};

export const createOutputNotFoundLog: CreateOutputNotFoundLog = ({
  commitMessagesSearchResult,
  titleSearchResult,
  commit,
  message,
  phrase,
}) => {
  let log = '';

  if (commitMessagesSearchResult === false) {
    log += `commit message: ${commit!.message} sha: ${commit!.sha}`;
  }

  if (titleSearchResult === false) {
    log += ` & pull request title: ${message}`;
  }

  log = log.replace(leadingAmpersandRegex, '');

  return `❗ "${phrase}" not found in: ${log}. continuing workflow...`;
};
