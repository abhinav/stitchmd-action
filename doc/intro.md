# Introduction

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
