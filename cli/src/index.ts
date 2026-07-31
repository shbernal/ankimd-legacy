#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'

import {
  ANKIMD_PACKAGE_NAME,
  ANKIMD_VERSION,
  convertAnkiTxtToMarkdown,
} from '@shbernal/ankimd'

const helpText = `ankimd

Convert Anki exports to Markdown.

Usage:
  ankimd convert <input.txt> [--output <output.md>]
  ankimd --help
  ankimd --version

Package:
  ${ANKIMD_PACKAGE_NAME}
`

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.includes('--version') || args.includes('-v')) {
    console.log(ANKIMD_VERSION)
    return
  }

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(helpText)
    return
  }

  const [command, ...rest] = args

  if (command !== 'convert') {
    throw new Error(`Unknown command: ${command}`)
  }

  const { inputPath, outputPath } = parseConvertArgs(rest)
  const resolvedInputPath = resolveCliPath(inputPath)
  const resolvedOutputPath = outputPath ? resolveCliPath(outputPath) : undefined
  const source = await fs.readFile(resolvedInputPath, 'utf8')
  const result = convertAnkiTxtToMarkdown(source, {
    sourceName: path.basename(resolvedInputPath),
  })

  if (resolvedOutputPath) {
    await fs.writeFile(resolvedOutputPath, result.markdown, 'utf8')
    return
  }

  process.stdout.write(result.markdown)
}

function resolveCliPath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath
  }

  const callerCwd = process.env.ANKIMD_CALLER_CWD
  const baseDir = callerCwd?.trim() ? callerCwd : process.cwd()

  return path.resolve(baseDir, filePath)
}

function parseConvertArgs(args: string[]): {
  inputPath: string
  outputPath?: string
} {
  const positionalArgs: string[] = []
  let outputPath: string | undefined

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--output' || arg === '-o') {
      outputPath = args[index + 1]

      if (!outputPath) {
        throw new Error('Missing value for --output')
      }

      index += 1
      continue
    }

    positionalArgs.push(arg)
  }

  const inputPath = positionalArgs[0]

  if (!inputPath) {
    throw new Error('Missing input file path')
  }

  return {
    inputPath,
    outputPath,
  }
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
})
