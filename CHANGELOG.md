# Change Log

## 1.1.0 - 2020-11-24

New `fail-fast` and full `push` support

### Notable Changes

- New `fail-fast` input option
  - new optional input for immediately failing workflow. [#26](https://github.com/saulmaldonado/skip-workflow/pull/25)
- Fixes support for on `push` workflow event trigger
  - Fixed support for deep searching commits in push event workflow trigger [#27](https://github.com/saulmaldonado/skip-workflow/pull/27)

### Other changes

- Adds new e2e test for RegExp phrases [0b3ea37](https://github.com/saulmaldonado/skip-workflow/tree/0b3ea3760c2f27441f7cad71787b2f7ced969ffb)

- Edits CI workflow to allow PRs to use repo secrets [098919f](https://github.com/saulmaldonado/skip-workflow/commit/098919fcc248348037287363cc22d01dbb055379)

- Edits codecov action to work with `pull_request_target` [8e0605c](https://github.com/saulmaldonado/skip-workflow/commit/8e0605c8f721e01441da09b0316c37d7f980e4d2)

- Refactors `parsePhraseInput` modules [357c5fe](https://github.com/saulmaldonado/skip-workflow/commit/357c5fe950065e0fc3e3825e8a084a8ed9cb2041)

## 1.0.0 - 2020-11-16

Initial release 🚀
