import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';

export type SearchIn<T> = (
  octokit: ReturnType<typeof getOctokit>,
  context: Context,
  phrase: string,
) => Promise<T>;
