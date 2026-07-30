const ANSWER_SEPARATOR_PATTERN = /<hr\b[^>]*\bid\s*=\s*["']?answer["']?[^>]*>/i

export function splitAnswerHtml(renderedCardHtml: string): {
  frontHtml: string
  answerHtml: string
} {
  const match = ANSWER_SEPARATOR_PATTERN.exec(renderedCardHtml)

  if (match?.index === undefined) {
    return {
      frontHtml: renderedCardHtml,
      answerHtml: renderedCardHtml,
    }
  }

  const frontHtml = renderedCardHtml.slice(0, match.index)
  const answerHtml = renderedCardHtml.slice(match.index + match[0].length)

  return {
    frontHtml,
    answerHtml,
  }
}
