# Contributor's Guide

Feedback, bug reports, and pull requests are welcome. Feel free to ask for [help](https://github.com/saulmaldonado/skip-workflow/issues).

### Guide:

1. [Fork it](https://help.github.com/articles/fork-a-repo/)
2. Clone it
3. Install dependencies (`npm install`)
4. Create new branch (Refer to `Naming Your Branch` for branch naming conventions)
5. Make changes
6. If adding features or making fixes, write tests for your changes using [Jest](https://jestjs.io/en/).
7. Test your project. ensure 100% code coverage (`npm test --coverage`)
8. Stage and commit (`pre-commit` hook with lint and format your changes. Address any linting errors if necessary)
9. Push and [Create new Pull Request](https://help.github.com/articles/creating-a-pull-request/)

## Naming Your Branch

Name your branch with the following convention: `fix/xxx` or `feat/xxx` or `docs/xxx` where `xxx` is a short description of the changes or feature you are attempting to add.

For branches made to address specific issues, add the issue Id to the end of the branch name following a `-`
ex. `fix/xxx-issue-x`

## Testing

We use [Jest](https://jestjs.io/en/) to write tests

## First Time Contributors

Working on your first Pull Request? You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)
