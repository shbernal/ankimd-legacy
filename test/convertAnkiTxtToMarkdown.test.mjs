import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

import { convertAnkiTxtToMarkdown } from '../packages/ankimd/dist/index.js'

const fixturePath = path.resolve(
  'test/input/english-vocabulary-anki-flashcards-export.txt',
)
const expectedPath = path.resolve('test/expected-output/english.md')

test('convertAnkiTxtToMarkdown matches the flashcards fixture snapshot', async () => {
  const [input, expected] = await Promise.all([
    readFile(fixturePath, 'utf8'),
    readFile(expectedPath, 'utf8'),
  ])

  const result = convertAnkiTxtToMarkdown(input, {
    sourceName: path.basename(fixturePath),
  })

  assert.equal(result.deckTitle, 'English Vocabulary')
  assert.equal(result.markdown, expected)
})
