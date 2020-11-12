import { Commit } from '../getCommits';

type CreateOutputFoundLog = (result: {
  commitMessagesSearchResult?: boolean;
  titleSearchResult?: boolean;
  message?: string;
}) => string;

type CreateOutputNotFoundLog = (result: {
  commitMessagesSearchResult?: boolean;
  titleSearchResult?: boolean;
  message?: string;
  commit?: Commit;
}) => string;

export const createOutputFoundLog: CreateOutputFoundLog = ({
  commitMessagesSearchResult,
  titleSearchResult,
  message = 'title',
}) => {
  let log = '';
  log += commitMessagesSearchResult ? 'all commit message' : '';
  log += titleSearchResult ? ` & ${message}` : '';
  return log.replace(/^ &/i, '');
};

export const createOutputNotFoundLog: CreateOutputNotFoundLog = ({
  commitMessagesSearchResult,
  titleSearchResult,
  commit,
  message,
}) => {
  let log = '';
  log += !commitMessagesSearchResult
    ? `${commit!.message} sha: ${commit!.sha}`
    : '';
  log += !titleSearchResult ? ` & ${message}` : '';
  return log.replace(/^ &/i, '');
};
