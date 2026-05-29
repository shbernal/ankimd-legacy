# ankimd

Core Anki-to-Markdown conversion utilities for `ankimd`.

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
