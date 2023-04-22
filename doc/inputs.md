# Inputs

stitchmd-action accepts the following inputs:

| Name | Description | Default |
| ---- | ----------- | ------- |
| `mode` | [Execution mode](modes.md). | check |
| `version` | Version of stitchmd. Either a full semantic version (`v1.2.3`) or `latest`. | `latest` |
| `github-token` | GitHub token for API requests. | `GITHUB_TOKEN` |
| `summary` | Input summary file. **Required** if `mode` is not `install`. | N/A |
| `output` | Generated output file. **Required** if `mode` is not `install`. | N/A |
| `preface` | Path to a file that will be included at the top of the output. | None |
| `offset` | Flat offset for all headings. | 0 |
| `no-toc` | Don't include the summary file table-of-contents in the output. | `false` |
| `check-can-fail` | In `check` mode, don't fail the job if `check` fails. | `false` |

See [stitchmd options](https://github.com/abhinav/stitchmd#options)
for specific details on some of these options.
