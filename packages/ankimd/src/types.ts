export interface ConvertAnkiToMarkdownOptions {
  deckTitle?: string
  sourceName?: string
}

export interface ParsedAnkiTxtHeader {
  key: string
  value: string
}

export interface ParsedAnkiTxtDocument {
  headers: ParsedAnkiTxtHeader[]
  rows: string[][]
  separator: string
}

export interface MarkdownCard {
  title: string
  bullets: string[]
}

export interface ConvertAnkiToMarkdownResult {
  deckTitle: string
  cards: MarkdownCard[]
  markdown: string
}
