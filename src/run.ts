import { debug, getInput, setFailed, setOutput } from '@actions/core';
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { PullsGetResponseData } from '@octokit/types';
import { config } from './config';
import { Commit, getCommits } from './lib/getCommits';
import { getPullRequest } from './lib/getPullRequest';
import {
  createOutputFoundLog,
  createOutputNotFoundLog,
} from './lib/helpers/createOuputLog';
import { parseSearchInput } from './lib/parseSearchInput';
import { searchAllCommitMessages } from './lib/searchCommitMessages';
import { searchPullRequestMessage } from './lib/searchPullRequestMessage';

type Run = () => Promise<void>;
const run: Run = async () => {
  const {
    GITHUB_TOKEN_INPUT_ID,
    PHRASE_INPUT_ID,
    MATCH_FOUND_OUTPUT_ID,
    SEARCH_INPUT_ID,
  } = config;

  const { COMMIT_MESSAGES, PULL_REQUEST } = config.SEARCH_OPTIONS;

  try {
    const context = new Context();

    const githubToken: string = getInput(GITHUB_TOKEN_INPUT_ID, {
      required: true,
    });
    debug(`${GITHUB_TOKEN_INPUT_ID} input: ${githubToken}`);

    const phrase: string = getInput(PHRASE_INPUT_ID, { required: true });
    debug(`${PHRASE_INPUT_ID} input: ${phrase}`);

    const searchInput = getInput(SEARCH_INPUT_ID, { required: true });
    debug(`${SEARCH_INPUT_ID} input: ${searchInput}`);

    const searchOptions = parseSearchInput(searchInput);
    debug(`options: ${[...searchOptions].toString()}`);

    const octokit = getOctokit(githubToken);

    const searchResults: {
      commitMessagesSearchResult?: boolean;
      commit?: Commit;
      titleSearchResult?: boolean;
    } = {};

    // TODO: create a store of keeping results?

    if (searchOptions.has(COMMIT_MESSAGES)) {
      const commits = await getCommits(octokit, context);
      const {
        result: commitMessagesSearchResult,
        commit,
      } = searchAllCommitMessages(commits, phrase);

      searchResults.commitMessagesSearchResult = commitMessagesSearchResult;
      searchResults.commit = commit;
    }

    if (searchOptions.has(PULL_REQUEST)) {
      const pullRequest: PullsGetResponseData = await getPullRequest(
        octokit,
        context,
      );

      debug(
        JSON.stringify({ title: pullRequest.title, body: pullRequest.body }),
      );

      const { result: titleSearchResult } = searchPullRequestMessage(
        pullRequest,
        phrase,
      );

      searchResults.titleSearchResult = titleSearchResult;
    }

    const {
      commit,
      commitMessagesSearchResult,
      titleSearchResult,
    } = searchResults;

    // TODO: use store. has 'pass' props for skipping workflow

    if (commitMessagesSearchResult || titleSearchResult) {
      const foundLog = createOutputFoundLog({
        commitMessagesSearchResult,
        titleSearchResult,
      });

      console.log(`⏭ "${phrase}" found in: ${foundLog}. skipping workflow...`);

      setOutput(MATCH_FOUND_OUTPUT_ID, true);
    } else {
      const notFoundLog = createOutputNotFoundLog({
        commitMessagesSearchResult,
        titleSearchResult,
        commit,
      });

      console.log(
        `❗ "${phrase}" not found in ${notFoundLog}. continuing workflow...`,
      );

      setOutput(MATCH_FOUND_OUTPUT_ID, null);
    }
  } catch (error) {
    debug(error.stack ?? 'No error stack trace');

    error.message = `❌ ${error.message}`;

    setFailed(error);
  }
};

export default run;
