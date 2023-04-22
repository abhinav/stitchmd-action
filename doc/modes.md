# Execution Modes

stitchmd-action accepts a `mode` parameter specifying the execution mode.
This controls what the action does.
The following execution modes are supported:

- [Install](#install)
- [Check](#check)
- [Write](#write)

## Install

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

## Check

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

## Write

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
[Automatically update output](examples.md#automatically-update-output).
