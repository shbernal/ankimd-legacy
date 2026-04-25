#!/usr/bin/env node

import { ANKIMD_PACKAGE_NAME, ANKIMD_VERSION } from '@shbernal/ankimd'

const helpText = `ankimd

Convert Anki exports to Markdown.

Usage:
  ankimd --help
  ankimd --version

Status:
  Project scaffold only. Conversion commands are not implemented yet.

Package:
  ${ANKIMD_PACKAGE_NAME}
`

const args = process.argv.slice(2)

if (args.includes('--version') || args.includes('-v')) {
  console.log(ANKIMD_VERSION)
  process.exit(0)
}

console.log(helpText)
