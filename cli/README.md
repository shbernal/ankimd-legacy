# ankimd

[![weekly downloads](https://img.shields.io/npm/dw/%40shbernal%2Fankimd-cli.svg?label=npm%20downloads&logo=npm)](https://www.npmjs.com/package/@shbernal/ankimd-cli)
[![total downloads](https://img.shields.io/npm/dt/%40shbernal%2Fankimd-cli.svg?label=npm%20total%20downloads&logo=npm)](https://www.npmjs.com/package/@shbernal/ankimd-cli)

Convert Anki exports into readable Markdown flashcards.

## Installation

- `pnpm i -g @shbernal/ankimd-cli`

### Requirements

- Node >=20

## Usage

- `ankimd convert <input.txt>`
- `ankimd convert <input.txt> --output <output.md>`

## Status

- Flashcards `.txt` export conversion is implemented.
- `.apkg` support is not implemented yet.

## Local development

- Run the repo-local CLI from the workspace root:
  - `pnpm ankimd-local -- --help`
- Run the pack and smoke-install flow:
  - `pnpm cli-local-test`
