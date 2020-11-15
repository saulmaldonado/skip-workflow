import { debug, getInput, setFailed, setOutput } from '@actions/core';
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { config } from './config';
import { Commit } from './lib/getCommits';
import { generateOutput } from './lib/generateOutput';
import { parseSearchInput } from './lib/parseSearchInput';
import { searchInCommits } from './searchInCommits';
import { searchInPullRequest } from './searchInPullRequest';
import { parsePrMessageOptionInput } from './lib/validateInput';

export type SearchResults = {
  commitMessagesSearchResult?: boolean;
  titleSearchResult?: boolean;
  commit?: Commit;
  message?: string;
};

const {
  GITHUB_TOKEN_INPUT_ID,
  PHRASE_INPUT_ID,
  SEARCH_INPUT_ID,
  MATCH_FOUND_OUTPUT_ID,
  PR_MESSAGE,
  SEARCH_OPTIONS: { COMMIT_MESSAGES, PULL_REQUEST },
} = config;

type Run = () => Promise<void>;
const run: Run = async () => {
  try {
    const context = new Context();

    const githubToken: string = getInput(GITHUB_TOKEN_INPUT_ID, {
      required: true,
    });
    debug(`${GITHUB_TOKEN_INPUT_ID} input: ${githubToken}`);

    const phrase = getInput(PHRASE_INPUT_ID, { required: true });
    debug(`${PHRASE_INPUT_ID} input: ${phrase}`);

    const searchInput = getInput(SEARCH_INPUT_ID, { required: true });
    debug(`${SEARCH_INPUT_ID} input: ${searchInput}`);

    const searchOptions = parseSearchInput(searchInput);
    debug(`options: ${[...searchOptions].toString()}`);

    const prMessageOption = parsePrMessageOptionInput(PR_MESSAGE);

    const octokit = getOctokit(githubToken);

    const searchResults: SearchResults = {};

    if (searchOptions.has(COMMIT_MESSAGES)) {
      const {
        result: commitMessagesSearchResult,
        commit,
      } = await searchInCommits(octokit, context, phrase);

      searchResults.commitMessagesSearchResult = commitMessagesSearchResult;
      searchResults.commit = commit;
    }

    if (searchOptions.has(PULL_REQUEST)) {
      const { result: titleSearchResult, message } = await searchInPullRequest(
        octokit,
        context,
        phrase,
        {
          textToSearch: prMessageOption,
        },
      );

      searchResults.titleSearchResult = titleSearchResult;
      searchResults.message = message;
    }

    const { log, result } = generateOutput({ ...searchResults, phrase });

    console.log(log);

    setOutput(MATCH_FOUND_OUTPUT_ID, result);
  } catch (error) {
    debug(error.stack ?? 'No error stack trace');

    error.message = `❌ ${error.message}`;

    setFailed(error);
  }
};

export default run;
