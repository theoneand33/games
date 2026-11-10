# CI review notes

- `cargo` commands are blocked in this job. Do not run or retry them.
- `check.yml` already builds and tests every PR on Linux, macOS and Windows. Review by reading the diff and the code it touches.
- Read the PR diff first (`gh pr diff`). Open a full file only when the diff is unclear without it. Skip lockfiles, generated files and vendored code.
- Report only bugs, security issues and regressions. No style nits, no summaries of the diff, no praise.
- Post one review comment. Keep it short. Do not edit files or browse the web.
