import path from 'node:path'

import {
  extractCardTitle,
  renderHtmlFragmentAsBullets,
} from './html/normalizeCardHtml.js'
import { splitAnswerHtml } from './html/splitAnswer.js'
import { renderCardsMarkdown } from './markdown/renderCardsMarkdown.js'
import { parseAnkiFlashcardsExport } from './txt/parseAnkiFlashcardsExport.js'
import type {
  ConvertAnkiToMarkdownOptions,
  ConvertAnkiToMarkdownResult,
  MarkdownCard,
} from './types.js'

export function convertAnkiTxtToMarkdown(
  input: string,
  options: ConvertAnkiToMarkdownOptions = {},
): ConvertAnkiToMarkdownResult {
  const document = parseAnkiFlashcardsExport(input)
  const cards = document.rows
    .map(row => convertRowToCard(row))
    .filter((card): card is MarkdownCard => card !== null)

  const deckTitle =
    options.deckTitle ??
    deriveDeckTitleFromSourceName(options.sourceName) ??
    'Anki Flashcards'

  return {
    deckTitle,
    cards,
    markdown: renderCardsMarkdown(deckTitle, cards),
  }
}

function convertRowToCard(row: string[]): MarkdownCard | null {
  const [frontColumn = '', renderedCardColumn = ''] = row
  const answerSource = renderedCardColumn || frontColumn
  const { frontHtml, answerHtml } = splitAnswerHtml(answerSource)
  const title = extractCardTitle(frontColumn || frontHtml)
  const bullets = renderHtmlFragmentAsBullets(answerHtml)

  if (!title || bullets.length === 0) {
    return null
  }

  return {
    title,
    bullets,
  }
}

function deriveDeckTitleFromSourceName(sourceName?: string): string | null {
  if (!sourceName) {
    return null
  }

  const fileName = path.basename(sourceName, path.extname(sourceName))
  const withoutSuffix = fileName.replace(
    /-(?:anki-)?(?:flashcards|notes)-export$/i,
    '',
  )
  const words = withoutSuffix
    .split(/[-_]+/)
    .map(word => word.trim())
    .filter(Boolean)

  if (words.length === 0) {
    return null
  }

  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
