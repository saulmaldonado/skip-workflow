import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';

export type SearchInParameters = {
  octokit: ReturnType<typeof getOctokit>;
  context: Context;
  phrase: string;
};

export type SearchIn<T> = (args: SearchInParameters) => Promise<T>;
