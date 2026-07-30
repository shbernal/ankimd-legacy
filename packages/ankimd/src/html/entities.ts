const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
}

export function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,
    (_match: string, entity: string) => {
      if (entity.startsWith('#x') || entity.startsWith('#X')) {
        const codePoint = Number.parseInt(entity.slice(2), 16)
        return Number.isNaN(codePoint)
          ? _match
          : String.fromCodePoint(codePoint)
      }

      if (entity.startsWith('#')) {
        const codePoint = Number.parseInt(entity.slice(1), 10)
        return Number.isNaN(codePoint)
          ? _match
          : String.fromCodePoint(codePoint)
      }

      return NAMED_ENTITIES[entity] ?? _match
    },
  )
}
