import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';

export type SearchIn<T, K = Object> = (
  octokit: ReturnType<typeof getOctokit>,
  context: Context,
  phrase: string,
  options?: K,
) => Promise<T>;
