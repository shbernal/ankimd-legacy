import type { MarkdownCard } from '../types.js'

export function renderCardsMarkdown(
  deckTitle: string,
  cards: MarkdownCard[],
): string {
  const sections = cards.map(card => {
    const bullets = card.bullets.map(bullet => `- ${bullet}`).join('\n')
    return `## ${card.title}\n${bullets}`
  })

  return [`# ${deckTitle}`, ...sections].join('\n\n').trimEnd() + '\n'
}
