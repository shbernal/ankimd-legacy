# ankimd

Convert Anki exports into Markdown.

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
