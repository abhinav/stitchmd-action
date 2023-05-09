# Examples

## Automatically update output

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

### Automatically update for PRs only

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

### Automatically update PRs made from forks

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

## Install-only

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

### Add to PATH

You can add the install directory to your `$PATH`
so that you don't have to type the long GitHub expression
to access the path.

```yaml
      - run: |
          dirname "${{ steps.stitchmd.outputs.install-path }}" >> "$GITHUB_PATH"
          stitchmd -version
```
