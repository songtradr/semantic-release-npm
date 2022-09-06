# songtradr/semantic-release-npm action

> Semantically (pre-)release package

Automatically publish new versions and preview versions of pull requests to npm using [semantic-release](https://github.com/semantic-release/semantic-release) and [semantish-prerelease](https://github.com/Xiphe/semantish-prerelease).

## Use

```yml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - main
      - next
      - next-major
      - beta
      - alpha
      - "*.x"
  pull_request:

permissions:
  actions: write
  contents: write
  issues: write
  pull-requests: write
  packages: write

defaults:
  run:
    shell: bash

jobs:
  release:
    runs-on: ubuntu-latest
    name: Build & Publish
    steps:
      - name: 🛑 Cancel Previous Runs
        uses: styfle/cancel-workflow-action@0.9.1

      - name: ⬇️ Checkout repo
        uses: actions/checkout@v3

      - name: ⎔ Setup node
        uses: actions/setup-node@v3
        with:
          node-version: 16
          ### Optionally configure your private npm here
          registry-url: "https://npm.pkg.github.com"
          scope: "@songtradr"

      # test, build, prepare here

      ############################################################
      # All above is opinionated, all below is about this action #
      ############################################################

      - name: 🚀 Publish
        uses: songtradr/semantic-release-npm@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

          ### The directory in which the release should be performed (Default: .)
          directory: .
          ### Wether to publish preview releases for pull requests (Default: true)
          pre_release: true
          ### Wether to apply common configuration for semantic release (Default: true)
          add_config: true
```
