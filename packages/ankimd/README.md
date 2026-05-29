# ankimd

[![weekly downloads](https://img.shields.io/npm/dw/%40shbernal%2Fankimd.svg?label=npm%20downloads&logo=npm)](https://www.npmjs.com/package/@shbernal/ankimd)
[![total downloads](https://img.shields.io/npm/dt/%40shbernal%2Fankimd.svg?label=npm%20total%20downloads&logo=npm)](https://www.npmjs.com/package/@shbernal/ankimd)

Convert Anki exports into readable Markdown flashcards.

## Requirements

- Node.js >= 20
- ESM

## Install

```sh
pnpm add @shbernal/ankimd
```

## Usage

```ts
import { convertAnkiTxtToMarkdown } from '@shbernal/ankimd'

const result = convertAnkiTxtToMarkdown(txtExport, {
  sourceName: 'english-vocabulary-anki-flashcards-export.txt',
})
```

## Status

- Flashcards `.txt` export conversion is available.
- `.apkg` support is not implemented yet.
