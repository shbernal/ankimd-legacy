ankimd
======

Convert Anki exports into Markdown. This repository hosts the CLI plus the
shared package that will power the conversion pipeline.

Project layout
- `cli/`: The published CLI (`@shbernal/ankimd-cli`)
- `packages/`: Shared library code used by the CLI
- `scripts/`, `turbo.json`, `pnpm-workspace.yaml`: Repo-level tooling

Requirements
- Node.js >= 20

Install (CLI)
```bash
pnpm i -g @shbernal/ankimd-cli
```

Local repo workflows
- Run the local-dev CLI against repo sources from the project root:
  - `pnpm ankimd-local -- --help`
- Run the pack/install smoke test from the project root:
  - `pnpm cli-local-test`
- `pnpm cli-local-test` defaults to writing tarballs under `.tmp/packed/`.
- Override the pack output directory when needed:
  - `ANKIMD_PACK_DIR=/tmp/ankimd-packed pnpm cli-local-test`

Status
- The repository scaffold is in place.
- Converter implementation is intentionally not included yet.
