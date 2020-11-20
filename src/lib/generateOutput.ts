import { Commit } from './getCommits';

type CreateOutputParameters = {
  commitMessagesSearchResult?: boolean;
  titleSearchResult?: boolean;
  message?: string;
  phrase: string | RegExp;
  commit?: Commit;
};

type CreateOutputFoundLog = (args: CreateOutputParameters) => string;

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

type CreateOutputNotFoundLog = (args: CreateOutputParameters) => string;

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

type GenerateOutput = (
  args: CreateOutputParameters,
) => { result: true | null; log: string };

/**
 * creates result and output log
 * @param {Object} CreateOutputParameters
 * @param {string} CreateOutputParameters.phrase
 * @param {boolean} [CreateOutputParameters.commitMessagesSearchResult]
 * @param {boolean} [CreateOutputParameters.titleSearchResult]
 * @param {string} [CreateOutputParameters.message]
 * @param {Commit} [CreateOutputParameters.commit]
 *
 * @returns {{log: string, result: boolean}}
 */

export const generateOutput: GenerateOutput = ({
  commitMessagesSearchResult,
  titleSearchResult,
  commit,
  message,
  phrase,
}) => {
  if (commitMessagesSearchResult || titleSearchResult) {
    const log = createOutputFoundLog({
      commitMessagesSearchResult,
      titleSearchResult,
      phrase,
      message,
    });

    const result = true;

    return { log, result };
  }

  const log = createOutputNotFoundLog({
    commitMessagesSearchResult,
    titleSearchResult,
    commit,
    message,
    phrase,
  });

  const result = null;

  return { log, result };
};
