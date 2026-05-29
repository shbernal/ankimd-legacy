export { convertAnkiTxtToMarkdown } from './convertAnkiTxtToMarkdown.js'
export { parseAnkiFlashcardsExport } from './txt/parseAnkiFlashcardsExport.js'
export type {
  ConvertAnkiToMarkdownOptions,
  ConvertAnkiToMarkdownResult,
  MarkdownCard,
  ParsedAnkiTxtDocument,
  ParsedAnkiTxtHeader,
} from './types.js'

export const ANKIMD_PACKAGE_NAME = '@shbernal/ankimd'
export const ANKIMD_VERSION = '0.1.2'

export function getAnkimdPackageName(): string {
  return ANKIMD_PACKAGE_NAME
}
