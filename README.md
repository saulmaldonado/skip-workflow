<p align="center">
  <a href="https://github.com/saulmaldonado/skip-workflow/actions?query=workflow%3ACI"><img alt="CI status" src="https://github.com/saulmaldonado/skip-workflow/workflows/CI/badge.svg"></a>
  <a href="https://codecov.io/gh/saulmaldonado/skip-workflow">
  <img alt="codecov status" src="https://codecov.io/gh/saulmaldonado/skip-workflow/branch/main/graph/badge.svg" />
</a>
  <a href="https://opensource.org/licenses/MIT">
  <img alt="license: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</a>
  <a href="http://makeapullrequest.com">
  <img alt="license: MIT" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" />
</a>
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/saulmaldonado/skip-workflow">
</p>

# Skip Workflow

### Github action for skipping workflows upon matching with commit message(s) or pull request

Works by matching string or RegExp with any combination of **all** commit messages, pull request title, and/or pull request body. Output can be used used to conditionally run the following jobs or steps

## Inputs

### `phrase`

**Required**: String phrase or RegExp to search for.

```yaml
with:
  phrase: '[skip-workflow]' # searches for phrase anywhere in text
  # or
  phrase: '/^\\[skip-workflow\\]/i'
  # if any symbols are escaped or metacharacters are used, backslashes must be escaped to work
```

### `search`

**Required**: Text to search in for match. `JSON array`.

**default**: `'["commit_messages"]'`

```yaml
with:
  search: '["commit_messages", "pull_request"]' # any combination
```

### `pr-message`

**Required**: Pull request text to search in. `search` input must include `"pull_request"`.

**default**: `'title'`

```yaml
with:
  search: '["pull_request"]' # pull_request must be included in search input array

  pr-message: 'title'
  # or
  pr-message: 'body'
  # or
  pr-message: 'title & body'
```

### `github-token`

**Required**: Github workflow context token needed to search commits and pull request.

```yaml
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Output

### `skip-job`

Result of search.

Can be:

- `true` : Match passed, workflow can be skipped
- `null` : Match not passed, workflow must continue

```yaml
outputs:
  skip: ${{ steps.skip-workflow.outputs.skip }}

  steps:
    - uses: actions/checkout@v2

      id: skip-workflow
      uses: saulmaldonado/skip-workflow@v1
      with:
        phrase: '[skip-workflow]'
        github-token: ${{ secrets.GITHUB_TOKEN }}

    - name: test
      if: ${{ !steps.skip-workflow.outputs.skip }} # conditionally run following steps
```

## Code in Main

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
