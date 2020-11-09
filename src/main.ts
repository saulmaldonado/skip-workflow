import { debug, getInput, setFailed, setOutput } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { config } from './config';
import { getCommits } from './lib/getCommits';
import { searchAllCommitMessages } from './lib/searchCommitMessages';

type Run = () => Promise<void>;
const run: Run = async () => {
  const {
    GITHUB_TOKEN_INPUT_ID,
    PHRASE_INPUT_ID,
    MATCH_FOUND_OUTPUT_ID,
  } = config;

  try {
    const githubToken: string = getInput(GITHUB_TOKEN_INPUT_ID, {
      required: true,
    });
    debug(`${GITHUB_TOKEN_INPUT_ID} input: ${githubToken}`);

    const phrase: string = getInput(PHRASE_INPUT_ID, { required: true });
    debug(`${PHRASE_INPUT_ID} input: ${phrase}`);

    const octokit = getOctokit(githubToken);

    const commits = await getCommits(octokit, context);

    const { result, commit } = searchAllCommitMessages(commits, phrase);

    if (result) {
      console.log(
        `⏭ "${phrase}" found in all commit messages. skipping workflow...`,
      );

      setOutput(MATCH_FOUND_OUTPUT_ID, result);
    } else {
      console.log(
        `❗ "${phrase}" not found in "${commit!.message}" sha: ${
          commit!.sha
        }. continuing workflow...`,
      );

      setOutput(MATCH_FOUND_OUTPUT_ID, null);
    }
  } catch (error) {
    debug(error.stack ?? 'No error stack trace');

    error.message = `❌ ${error.message}`;

    setFailed(error);
  }
};

run();
