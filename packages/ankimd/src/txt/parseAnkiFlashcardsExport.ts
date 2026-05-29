import type { ParsedAnkiTxtDocument, ParsedAnkiTxtHeader } from '../types.js'

const DEFAULT_SEPARATOR = '\t'

export function parseAnkiFlashcardsExport(
  input: string,
): ParsedAnkiTxtDocument {
  const headerMatch = input.match(/^(?:#[^\n]*(?:\n|$))*/)
  const headerBlock = headerMatch?.[0] ?? ''
  const data = input.slice(headerBlock.length)

  const headers = parseHeaders(headerBlock)
  const separator = getSeparator(headers)
  const rows = parseDelimitedRows(data, separator)

  return {
    headers,
    rows,
    separator,
  }
}

function parseHeaders(headerBlock: string): ParsedAnkiTxtHeader[] {
  return headerBlock
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const raw = line.startsWith('#') ? line.slice(1) : line
      const separatorIndex = raw.indexOf(':')

      if (separatorIndex === -1) {
        return { key: raw.trim(), value: '' }
      }

      return {
        key: raw.slice(0, separatorIndex).trim(),
        value: raw.slice(separatorIndex + 1).trim(),
      }
    })
}

function getSeparator(headers: ParsedAnkiTxtHeader[]): string {
  const separatorHeader = headers.find(header => header.key === 'separator')

  if (!separatorHeader) {
    return DEFAULT_SEPARATOR
  }

  if (separatorHeader.value === 'tab') {
    return '\t'
  }

  return separatorHeader.value || DEFAULT_SEPARATOR
}

function parseDelimitedRows(input: string, separator: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    const nextChar = input[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"'
        index += 1
        continue
      }

      inQuotes = !inQuotes
      continue
    }

    if (!inQuotes && char === separator) {
      row.push(field)
      field = ''
      continue
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && nextChar === '\n') {
        index += 1
      }

      row.push(field)
      field = ''

      if (row.some(value => value.length > 0)) {
        rows.push(row)
      }

      row = []
      continue
    }

    field += char
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)

    if (row.some(value => value.length > 0)) {
      rows.push(row)
    }
  }

  return rows
}
