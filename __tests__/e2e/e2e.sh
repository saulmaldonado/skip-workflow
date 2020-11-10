#!/bin/bash

curl \
  -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $1" \
  https://api.github.com/repos/saulmaldonado/skip-workflow/actions/workflows/3497271/dispatches \
  -d '{"ref":"main"}'

