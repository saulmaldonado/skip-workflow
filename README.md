<p align="center">
  <a href="https://github.com/saulmaldonado/skip-workflow/actions?query=workflow%3ACI"><img alt="CI status" src="https://github.com/saulmaldonado/skip-workflow/workflows/CI/badge.svg"></a>
  <a href="https://codecov.io/gh/saulmaldonado/skip-workflow">
  <img alt="codecov status" src="https://codecov.io/gh/saulmaldonado/skip-workflow/branch/main/graph/badge.svg" />
</a>
  <a href="https://opensource.org/licenses/MIT">
  <img alt="license: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</a>
  <a href="http://makeapullrequest.com">
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
</a>
  <a href="https://GitHub.com/saulmaldonado/skip-workflow/releases/">
  <img alt="release" src="https://img.shields.io/github/release/saulmaldonado/skip-workflow.svg" />
</a>
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/saulmaldonado/skip-workflow">
</p>

# ⚠ Github Actions now natively supports skipping workflows

As of February 8, 2021, Github Actions natively support skipping pull request and push workflow if any of the commit messages in your push or the HEAD commit of your PR contains 
`[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, or `[actions skip]`. This achieves the exact same effect as the action without the need to change or structure your workflow in a certain way. You can still use this action to programatically run different jobs or steps. [Run steps programatically example](#run-steps-programatically)

# Skip Workflow

## Github action for skipping workflows upon matching or finding phrase in commit message(s) or pull request

Works by searching for phrase in or matching RegExp with commit message(s), pull request title, and/or pull request body. `skip` output value can then be used to conditionally skip the following jobs or steps.

Github Actions does not natively support skipping or canceling workflow based on phrases in commit message like other CI tools do. This action was made to replicate this feature and let repositories save on CI minutes for small non-impacting changes to code bases.

[Github workflow token](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow#using-the-github_token-in-a-workflow) is needed to make authenticated requests for commit and pull requests.

## Sample Scenarios

## Skip rest of job if phrase is found in **_all_** commit messages of the incoming pull request

```yaml
name: 'NodeJS CI'
on:
  push:
    pull_request:
      - main
      - master
jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: skip-workflow
      
        id: skip-workflow # id used for referencing step
        
        uses: saulmaldonado/skip-workflow@v1
        with:
          phrase: 'skip-workflow'
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Use Node.js ${{ matrix.node-version }}
        if: ${{ !steps.skip-workflow.outputs.skip }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm install

      - name: Build
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm run build

      - name: Test
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm test
```

---

## Skip rest of job if RegExp matches with **_all_** commit messages of the incoming pull request

<details>
  <summary>View example workflow </summary>

```yaml
name: 'NodeJS CI'
on:
  push:
    pull_request:
      - main
      - master
jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: skip-workflow
        id: skip-workflow # id used for referencing step
        uses: saulmaldonado/skip-workflow@v1
        with:
          phrase: /^\[skip-workflow\]/i # matches with commits starting with '[skip-workflow]'
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Use Node.js ${{ matrix.node-version }}
        if: ${{ !steps.skip-workflow.outputs.skip }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm install

      - name: Build
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm run build

      - name: Test
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm test
```

</details>

---

## Skip all other jobs if phrase is found in **_all_** commit messages of the incoming pull request

<details>

  <summary>View example workflow </summary>

```yaml
name: 'NodeJS CI'
on:
  push:
    pull_request:
      - main
      - master

jobs:
  skip-workflow:
    runs-on: ubuntu-latest

    outputs: # job outputs
      skip: ${{ steps.skip-workflow.outputs.skip }}

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: skip-workflow
        id: skip-workflow # id used for referencing step
        uses: saulmaldonado/skip-workflow@v1
        with:
          phrase: '[skip-workflow]'
          github-token: ${{ secrets.GITHUB_TOKEN }}

  build:
    needs: skip-workflow # needs is required for reference and to prevent both jobs running at the same time

    if: ${{ !needs.skip-workflow.outputs.skip }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm install

      - name: Build
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm run build
```

</details>

---

## Skip rest of job if phrase is found in **_all_** commit messages and the **_title_** of the incoming pull request

<details>
  <summary>View example workflow </summary>

```yaml
name: 'NodeJS CI'
on:
  push:
    pull_request:
      - main
      - master
jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: skip-workflow
        id: skip-workflow # id used for referencing step
        uses: saulmaldonado/skip-workflow@v1
        with:
          phrase: '[skip-workflow]'
          search: '["commit_messages", "pull_request"]' # search commits and pr title
          pr-message: 'title'
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Use Node.js ${{ matrix.node-version }}
        if: ${{ !steps.skip-workflow.outputs.skip }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm install

      - name: Build
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm run build

      - name: Test
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm test
```

</details>

---

## Skip rest of job if phrase is found in **_all_** commit messages in push to main/master branch

<details>

  <summary>View example workflow </summary>

```yaml
name: 'NodeJS CI'
on:
  push:
    branches:
      - main
      - master
jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: skip-workflow
        id: skip-workflow # id used for referencing step
        uses: saulmaldonado/skip-workflow@v1
        with:
          phrase: '[skip-workflow]'
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Use Node.js ${{ matrix.node-version }}
        if: ${{ !steps.skip-workflow.outputs.skip }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm install

      - name: Build
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm run build

      - name: Test
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm test
```

</details>

---

## Skip all other jobs if phrase is found in **_all_** commit messages in push to main/master branch

<details>

  <summary>View example workflow </summary>

```yaml
name: 'NodeJS CI'
on:
  push:
    branches:
      - main
      - master
jobs:
  skip-workflow:
    runs-on: ubuntu-latest

    outputs:
      skip: ${{ steps.skip-workflow.outputs.skip }}

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: skip-workflow
        id: skip-workflow # id used for referencing step
        uses: saulmaldonado/skip-workflow@v1
        with:
          phrase: '[skip-workflow]'
          github-token: ${{ secrets.GITHUB_TOKEN }}

  build:
    needs: skip-workflow # needs is required for reference and to prevent both jobs running at the same time

    if: ${{ !needs.skip-workflow.outputs.skip }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm install

      - name: Build
        if: ${{ !steps.skip-workflow.outputs.skip }}
        run: npm run build
```

</details>

---

## Fail and skip workflow immediately if phrase is found in **_all_** commit messages in push to main/master branch

<details>

  <summary>View example workflow </summary>

```yaml
name: 'NodeJS CI'
on:
  push:
    branches:
      - main
      - master
jobs:
  skip-workflow:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: skip-workflow
        id: skip-workflow # id used for referencing step
        uses: saulmaldonado/skip-workflow@v1
        with:
          phrase: '[skip-workflow]'
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: build
        run: npm run build

      - name: test
        run: npm run test
```

</details>

---

## Inputs

### `phrase`

**Required**: String phrase or RegExp to search for.

```yaml
with:
  phrase: '[skip-workflow]' # searches for phrase anywhere in text
  # or
  phrase: '/^\[skip-workflow\]/i'
```

### `search`

Text to search in for match. `JSON array`.

**default**: `'["commit_messages"]'`

```yaml
with:
  search: '["commit_messages", "pull_request"]' # any combination
```

### `pr-message`

Pull request text to search in. To be used along side `search` option input `'["pull_request"]'`.

**default**: `'title'`

```yaml
with:
  search: '["pull_request"]' # pull_request must be included in search option input array

  pr-message: 'title' # default
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

### `fail-fast`

Skip and fail workflow immediately after action confirms workflow can be skipped. Enabling this will fail the check.

**default**: `'false'`

```yaml
with:
  fail-fast: 'false' # default
  # or
  fail-fast: 'true'
```

## Output

### `skip`

Result of search.

Can be:

- `true` : Match passed, workflow can be skipped
- `null` : Match not passed, workflow must continue

```yaml
steps:
  - uses: actions/checkout@v2

  - name: skip-workflow
    id: skip-workflow # id used for referencing step
    uses: saulmaldonado/skip-workflow@v1
    with:
      phrase: '[skip-workflow]'
      github-token: ${{ secrets.GITHUB_TOKEN }}

  - name: test
    if: ${{ !steps.skip-workflow.outputs.skip }} # conditionally run following steps
```

## Run steps programatically

Since all this action does is search for phrase and regex matches in messages, it can be used for many other scenarios outside of skipping workflows. If you want to programatically run jobs based on phrases found in PR or commit messages you can do so by adding conditionals to steps/jobs.

The following workflow will search for `[deploy]` in any of the commit messages 


```yml
jobs:
  build-test-deploy:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: run-deploy
      
        id: run-deploy # id used for referencing step
        
        uses: saulmaldonado/skip-workflow@v1
        with:
          phrase: '[deploy]'
          github-token: ${{ secrets.GITHUB_TOKEN }}


      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        run: npm install

      - name: Build
        run: npm run build
       
      - name: Test
        run: npm test

      - name: Deploy
        if: ${{ steps.run-deploy.outputs.skip }} # This step will only run if `[deploy]` is found
        run: npm run deploy

```
