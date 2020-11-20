export const config = {
  PHRASE_INPUT_ID: 'phrase',
  GITHUB_TOKEN_INPUT_ID: 'github-token',
  MATCH_FOUND_OUTPUT_ID: 'skip',
  SEARCH_INPUT_ID: 'search',
  PR_ID_INPUT_ID: 'pr-id',
  FAIL_FAST_INPUT_ID: 'fail-fast',
  SEARCH_OPTIONS: {
    PULL_REQUEST: 'pull_request',
    COMMIT_MESSAGES: 'commit_messages',
  },
  PR_MESSAGE_OPTIONS: {
    TITLE: 'title',
    BODY: 'body',
    TITLEANDBODY: 'title & body',
  },
  PUSH_EVENT_NAME: 'push',
  PR_MESSAGE: 'pr-message',
} as const;
