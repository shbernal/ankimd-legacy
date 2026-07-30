ankimd
======

[![CI](https://github.com/shbernal/ankimd/actions/workflows/ci.yml/badge.svg)](https://github.com/shbernal/ankimd/actions/workflows/ci.yml)
[![core weekly downloads](https://img.shields.io/npm/dw/%40shbernal%2Fankimd.svg?label=npm%20downloads&logo=npm)](https://www.npmjs.com/package/@shbernal/ankimd)
[![core total downloads](https://img.shields.io/npm/dt/%40shbernal%2Fankimd.svg?label=npm%20total%20downloads&logo=npm)](https://www.npmjs.com/package/@shbernal/ankimd)
[![cli weekly downloads](https://img.shields.io/npm/dw/%40shbernal%2Fankimd-cli.svg?label=npm%20downloads&logo=npm)](https://www.npmjs.com/package/@shbernal/ankimd-cli)
[![cli total downloads](https://img.shields.io/npm/dt/%40shbernal%2Fankimd-cli.svg?label=npm%20total%20downloads&logo=npm)](https://www.npmjs.com/package/@shbernal/ankimd-cli)

Convert Anki exports into readable Markdown flashcards. This repository hosts
the CLI plus the shared package that powers the conversion pipeline.

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

Install (library)

```bash
pnpm add @shbernal/ankimd
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
