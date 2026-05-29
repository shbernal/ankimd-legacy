import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import test from 'node:test'

const execFileAsync = promisify(execFile)

const fixturePath = path.resolve(
  'test/input/english-vocabulary-anki-flashcards-export.txt',
)
const expectedPath = path.resolve('test/expected-output/english.md')
const cliPath = path.resolve('cli/dist/index.js')
const cliPackagePath = path.resolve('cli/package.json')

test('CLI version matches the package version', async () => {
  const packageJson = JSON.parse(await readFile(cliPackagePath, 'utf8'))
  const { stdout } = await execFileAsync(process.execPath, [
    cliPath,
    '--version',
  ])

  assert.equal(stdout, `${packageJson.version}\n`)
})

test('CLI convert writes the markdown snapshot to stdout', async () => {
  const expected = await readFile(expectedPath, 'utf8')
  const { stdout } = await execFileAsync(process.execPath, [
    cliPath,
    'convert',
    fixturePath,
  ])

  assert.equal(stdout, expected)
})

test('CLI convert writes the markdown snapshot to a file', async () => {
  const expected = await readFile(expectedPath, 'utf8')
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'ankimd-cli-test-'))
  const outputPath = path.join(tempDir, 'output.md')

  try {
    await execFileAsync(process.execPath, [
      cliPath,
      'convert',
      fixturePath,
      '--output',
      outputPath,
    ])

    const output = await readFile(outputPath, 'utf8')
    assert.equal(output, expected)
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
})

test('CLI convert resolves relative paths from ANKIMD_CALLER_CWD', async () => {
  const expected = await readFile(expectedPath, 'utf8')
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'ankimd-cli-caller-cwd-'))
  const repoRoot = path.resolve('.')
  const callerCwd = path.resolve('test')
  const outputPath = path.join(tempDir, 'relative-output.md')

  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        cliPath,
        'convert',
        'input/english-vocabulary-anki-flashcards-export.txt',
        '--output',
        outputPath,
      ],
      {
        cwd: repoRoot,
        env: {
          ...process.env,
          ANKIMD_CALLER_CWD: callerCwd,
        },
      },
    )

    assert.equal(stdout, '')

    const output = await readFile(outputPath, 'utf8')
    assert.equal(output, expected)
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
})
