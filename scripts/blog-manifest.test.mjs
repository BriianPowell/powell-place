import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

import {
  buildManifest,
  requireDateField,
  requireTagsField,
} from './generate-blog-manifest.mjs'

test('blog dates must be real YYYY-MM-DD values', () => {
  assert.equal(requireDateField({ date: '2026-08-08' }, 'valid-post'), '2026-08-08')
  assert.throws(() => requireDateField({ date: '2026-02-30' }, 'bad-post'))
  assert.throws(() => requireDateField({ date: '08/08/2026' }, 'bad-post'))
})

test('blog tags are normalized from arrays and comma-separated strings', () => {
  assert.deepEqual(requireTagsField({ tags: [' cloud ', 'security'] }, 'post'), [
    'cloud',
    'security',
  ])
  assert.deepEqual(requireTagsField({ tags: 'cloud, security' }, 'post'), [
    'cloud',
    'security',
  ])
  assert.throws(() => requireTagsField({ tags: [] }, 'bad-post'))
})

test('blog manifest generation validates slugs and frontmatter', async () => {
  const blogDir = await mkdtemp(path.join(tmpdir(), 'powell-place-blog-'))

  try {
    await writeFile(
      path.join(blogDir, 'hardening-notes.md'),
      [
        '---',
        'title: Hardening Notes',
        'description: Notes from a hardening pass.',
        'date: 2026-08-08',
        'tags: security, cloud',
        '---',
        '',
        '## Notes',
        '',
        'Keep the boundary small.',
      ].join('\n')
    )

    const manifest = buildManifest(blogDir)

    assert.match(manifest, /hardening-notes/)
    assert.match(manifest, /Hardening Notes/)
    assert.match(manifest, /Keep the boundary small/)
  } finally {
    await rm(blogDir, { force: true, recursive: true })
  }
})
