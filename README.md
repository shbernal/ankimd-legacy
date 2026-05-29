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
  - `pnpm ankimd-local -- convert test/input/english-vocabulary-anki-flashcards-export.txt`
- Run the pack/install smoke test from the project root:
  - `pnpm cli-local-test`
- Run the fixture-backed test suite from the project root:
  - `pnpm test`
- `pnpm cli-local-test` defaults to writing tarballs under `.tmp/packed/`.
- Override the pack output directory when needed:
  - `ANKIMD_PACK_DIR=/tmp/ankimd-packed pnpm cli-local-test`

Status
- Flashcards `.txt` export conversion is implemented.
- `.apkg` support is still a later phase.
