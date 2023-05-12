# stitchmd-action

- [Introduction](#introduction)
- [Usage](#usage)
  - [Execution Modes](#execution-modes)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Examples](#examples)
- [License](#license)

## Introduction

stitchmd-action is a GitHub action that you can use to
stitch together many Markdown files into a single Markdown file
using the [stitchmd](https://github.com/abhinav/stitchmd) tool.

<details>
<summary>What's stichmd?</summary>

With stitchmd, you define the layout of your document
in a **summary file** which defines a list of other Markdown files
and a hierarchy for them.

```markdown
- [Introduction](intro.md)
  - [Features](features.md)
- [Installation](install.md)
```

It combines these files together into a single Markdown file.
It handles cross-linking between files, relative links, etc.
See [stitchmd](https://github.com/abhinav/stitchmd) for more information.

</details>

## Usage

Assuming that your summary is defined in doc/SUMMARY.md,
and the result should be written to doc/README.md,
add the following to a GitHub Workflow.

```yaml
      - uses: actions/checkout@v3
      - uses: abhinav/stitchmd-action@v1
        with:
          summary: doc/SUMMARY.md
          output: doc/README.md
```

This will verify that doc/README.md is up-to-date
based on the contents of doc/SUMMARY.md
If the contents are out-of-date, it will fail the action.

Add `mode: write` to update `doc/README.md` in the workflow
instead of writing to it.

```yaml
      - uses: abhinav/stitchmd-action@v1
        with:
          summary: doc/SUMMARY.md
          output: doc/README.md
          mode: write
```

### Execution Modes

stitchmd-action accepts a `mode` parameter specifying the execution mode.
This controls what the action does.
The following execution modes are supported:

- [Install](#install)
- [Check](#check)
- [Write](#write)

#### Install

In install mode,
the action will install the requested version of stitchmd and exit.

```yaml
    steps:
    - name: Install stitchmd
      uses: abhinav/stitchmd-action@v1
      with:
        mode: install
        version: latest # optional: defaults to 'latest'
```

#### Check

In check mode,
the action will install stitchmd,
run it with the provided configuration,
and fail if the output file is out of date.

```yaml
    steps:
    - name: Check README
      uses: abhinav/stitchmd-action@v1
      with:
        mode: check
        summary: doc/SUMMARY.md
        output: doc/README.md
```

#### Write

In write mode,
the action will install stitchmd and
run it with the provided configuration.
If the output file is out-of-date,
it will be updated in-place.

```yaml
    steps:
    - name: Check README
      uses: abhinav/stitchmd-action@v1
      with:
        mode: write
        summary: doc/SUMMARY.md
        output: doc/README.md
```

Note that these changes will **not** be committed.
If you need that, see
[Automatically update output](#automatically-update-output).

### Inputs

stitchmd-action accepts the following inputs:

| Name             | Description                                                                 | Default        |
|------------------|-----------------------------------------------------------------------------|----------------|
| `mode`           | [Execution mode](#execution-modes).                                         | check          |
| `version`        | Version of stitchmd. Either a full semantic version (`v1.2.3`) or `latest`. | `latest`       |
| `github-token`   | GitHub token for API requests.                                              | `GITHUB_TOKEN` |
| `summary`        | Input summary file. **Required** if `mode` is not `install`.                | N/A            |
| `output`         | Generated output file. **Required** if `mode` is not `install`.             | N/A            |
| `preface`        | Path to a file that will be included at the top of the output.              | None           |
| `offset`         | Flat offset for all headings.                                               | 0              |
| `no-toc`         | Don't include the summary file table-of-contents in the output.             | `false`        |
| `check-can-fail` | In `check` mode, don't fail the job if `check` fails.                       | `false`        |

See [stitchmd options](https://github.com/abhinav/stitchmd#options)
for specific details on some of these options.

### Outputs

stitchmd-action produces the following outputs:

| Name           | Description                                                                                    |
|----------------|------------------------------------------------------------------------------------------------|
| `install-path` | The path at which the `stitchmd` binary is available.                                          |
| `check-failed` | In `check` mode, whether the check operation failed. The value is unspecified for other modes. |

### Examples

#### Automatically update output

If you want to keep the output file automatically up-to-date,
you can use an action like
[stefanzweifel/git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action)
after running stitchmd in `write` mode.

For example:

```yaml
on:
  push:
    branches: [main]
  pull_request:

jobs:
  update-docs:
    name: Update documentation
    runs-on: ubuntu-latest

    # Needed to give the job permission
    # to push to the repository.
    permissions:
      contents: write

    steps:
    - uses: actions/checkout@v3
    - name: Update README
      uses: abhinav/stitchmd-action@v1
      with:
        mode: write
        summary: doc/SUMMARY.md
        output: doc/README.md
    - uses: stefanzweifel/git-auto-commit-action@v4
      with:
        file_pattern: doc/README.md
        commit_message: 'Auto-update README.md with stitchmd'
```

##### Automatically update for PRs only

A safety requirement may be that the tool never pushes to main directly.
To get that, you can adjust the workflow above so that
it runs in `check` mode on the main branch,
and `write` mode for pull requests.

```yaml
    - name: Check or update README
      uses: abhinav/stitchmd-action@v1
      with:
        mode: ${{ github.event_name == 'pull_request' && 'write' || 'check' }}
        summary: doc/SUMMARY.md
        output: doc/README.md
```

##### Automatically update PRs made from forks

If a PR is made from a fork, git-auto-commit-action will not be able to push
using the configuration above.
See the [relevant documentation for the action](https://github.com/stefanzweifel/git-auto-commit-action#use-in-forks-from-public-repositories)
for more information, but in short,
you can use something like the following to get automatic updates in PRs made from forks.

```yaml
on:
  push:
    branches: [main]

  # Change the event to pull_request_target
  # so that it runs in the context of the base repository.
  pull_request_target:
  
jobs:
  update-docs:
    name: Update documentation
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
    - uses: actions/checkout@v3
      with:
        # Check out the fork so that pushes go to the fork.
        repository: ${{ github.event.pull_request.head.repo.full_name }}
        ref: ${{ github.head_ref }}
        
    - name: Check or update README
      uses: abhinav/stitchmd-action@v1
      with:
        # NOTE: event_name is pull_request_target in condition.
        mode: ${{ github.event_name == 'pull_request_target' && 'write' || 'check' }}
        summary: doc/SUMMARY.md
        output: doc/README.md
        
    - uses: stefanzweifel/git-auto-commit-action@v4
      # NOTE: event_name is pull_request_target in if condition.
      if: ${{ github.event_name == 'pull_request_target' }}
      with:
        file_pattern: doc/README.md
        commit_message: 'Auto-update README.md with stitchmd'
```

#### Install-only

If you want to install stitchmd but not run it, set `mode: install`.
This produces an output `install-path`, which you can use to access the file.

```yaml
      - id: stitchmd
        uses: abhinav/stitchmd-action@v1
        with:
          mode: install
      - run: |
          echo "Installed to ${{ steps.stitchmd.outputs.install-path }}"
          ${{ steps.stitchmd.outputs.install-path }} -version
```

##### Add to PATH

You can add the install directory to your `$PATH`
so that you don't have to type the long GitHub expression
to access the path.

```yaml
      - run: |
          dirname "${{ steps.stitchmd.outputs.install-path }}" >> "$GITHUB_PATH"
          stitchmd -version
```

## License

This software is made available under the MIT license.
