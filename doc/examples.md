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
