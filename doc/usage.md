# Usage

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
