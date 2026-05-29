import { decodeHtmlEntities } from './entities.js'

type TagToken =
  | { type: 'startTag'; name: string }
  | { type: 'endTag'; name: string }
  | { type: 'selfClosingTag'; name: string; attrs: Record<string, string> }
  | { type: 'text'; value: string }

const BLOCK_TAGS = new Set(['div', 'p'])
const LIST_CONTAINER_TAGS = new Set(['ul', 'ol'])
const LINE_BREAK_TAGS = new Set(['br'])
export function extractCardTitle(html: string): string {
  const lines = renderHtmlFragmentAsLines(html)

  if (lines.length === 0) {
    return normalizeWhitespace(decodeHtmlEntities(html))
  }

  return lines[lines.length - 1]
}

export function renderHtmlFragmentAsBullets(html: string): string[] {
  const lines = renderHtmlFragmentAsLines(html)
  return lines.filter(Boolean)
}

function renderHtmlFragmentAsLines(html: string): string[] {
  const tokens = tokenize(html)
  const bulletLines: string[] = []
  const blockParts: string[] = []
  const listItemParts: string[] = []
  let listDepth = 0

  const appendText = (value: string) => {
    const target = listDepth > 0 ? listItemParts : blockParts
    target.push(value)
  }

  const appendLineBreak = () => {
    const target = listDepth > 0 ? listItemParts : blockParts
    target.push('\n')
  }

  const flushListItem = () => {
    const normalizedLines = normalizeTextToLines(listItemParts.join(''))
    bulletLines.push(...normalizedLines)
    listItemParts.length = 0
  }

  const flushBlock = () => {
    const normalizedLines = normalizeTextToLines(blockParts.join(''))
    bulletLines.push(...normalizedLines)
    blockParts.length = 0
  }

  for (const token of tokens) {
    if (token.type === 'text') {
      appendText(token.value)
      continue
    }

    if (token.name === 'li') {
      if (token.type === 'startTag') {
        if (listItemParts.length > 0) {
          flushListItem()
        }

        listDepth += 1
        continue
      }

      if (token.type === 'endTag') {
        flushListItem()
        listDepth = Math.max(0, listDepth - 1)
      }

      continue
    }

    if (LIST_CONTAINER_TAGS.has(token.name)) {
      if (token.type === 'startTag') {
        if (listDepth === 0) {
          flushBlock()
        }
      } else if (token.type === 'endTag' && listDepth === 0) {
        flushBlock()
      }

      continue
    }

    if (BLOCK_TAGS.has(token.name)) {
      appendLineBreak()
      continue
    }

    if (LINE_BREAK_TAGS.has(token.name)) {
      appendLineBreak()
      continue
    }

    if (token.type === 'selfClosingTag' && token.name === 'img') {
      const src = token.attrs.src?.trim()

      if (src) {
        appendText(` ![](${src}) `)
      }

      continue
    }
  }

  flushListItem()
  flushBlock()

  return bulletLines
}

function tokenize(html: string): TagToken[] {
  const tokens: TagToken[] = []
  let index = 0

  while (index < html.length) {
    const openTagIndex = html.indexOf('<', index)

    if (openTagIndex === -1) {
      tokens.push({
        type: 'text',
        value: decodeHtmlEntities(html.slice(index)),
      })
      break
    }

    if (openTagIndex > index) {
      tokens.push({
        type: 'text',
        value: decodeHtmlEntities(html.slice(index, openTagIndex)),
      })
    }

    const closeTagIndex = html.indexOf('>', openTagIndex + 1)

    if (closeTagIndex === -1) {
      tokens.push({
        type: 'text',
        value: decodeHtmlEntities(html.slice(openTagIndex)),
      })
      break
    }

    const rawTag = html.slice(openTagIndex + 1, closeTagIndex).trim()
    index = closeTagIndex + 1

    if (!rawTag || rawTag.startsWith('!')) {
      continue
    }

    if (rawTag.startsWith('/')) {
      tokens.push({
        type: 'endTag',
        name: rawTag.slice(1).trim().toLowerCase(),
      })
      continue
    }

    const selfClosing = rawTag.endsWith('/')
    const [rawName, ...rawAttributeParts] = rawTag
      .replace(/\/$/, '')
      .trim()
      .split(/\s+/)
    const name = rawName.toLowerCase()

    if (name === 'img') {
      tokens.push({
        type: 'selfClosingTag',
        name,
        attrs: parseAttributes(rawAttributeParts.join(' ')),
      })
      continue
    }

    if (selfClosing) {
      tokens.push({ type: 'selfClosingTag', name, attrs: {} })
      continue
    }

    tokens.push({ type: 'startTag', name })
  }

  return mergeAdjacentTextTokens(tokens)
}

function parseAttributes(rawAttributes: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const pattern = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g

  for (const match of rawAttributes.matchAll(pattern)) {
    const [, name, doubleQuotedValue, singleQuotedValue, bareValue] = match
    attrs[name.toLowerCase()] = decodeHtmlEntities(
      doubleQuotedValue ?? singleQuotedValue ?? bareValue ?? '',
    )
  }

  return attrs
}

function mergeAdjacentTextTokens(tokens: TagToken[]): TagToken[] {
  const merged: TagToken[] = []

  for (const token of tokens) {
    const previous = merged[merged.length - 1]

    if (token.type === 'text' && previous?.type === 'text') {
      previous.value += token.value
      continue
    }

    merged.push(token)
  }

  return merged
}

function normalizeTextToLines(value: string): string[] {
  const normalized = normalizeWhitespace(value)

  if (!normalized) {
    return []
  }

  return normalized
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
}

function normalizeWhitespace(value: string): string {
  return value
    .replace(/\r/g, '\n')
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
