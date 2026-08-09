import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { expect, test } from 'vitest'

import {
  buildManifest,
  requireDateField,
  requireTagsField,
} from './generate-blog-manifest.mjs'

test('blog dates must be real YYYY-MM-DD values', () => {
  expect(requireDateField({ date: '2026-08-08' }, 'valid-post')).toBe(
    '2026-08-08'
  )
  expect(() => requireDateField({ date: '2026-02-30' }, 'bad-post')).toThrow()
  expect(() => requireDateField({ date: '08/08/2026' }, 'bad-post')).toThrow()
})

test('blog tags are normalized from arrays and comma-separated strings', () => {
  expect(requireTagsField({ tags: [' cloud ', 'security'] }, 'post')).toEqual([
    'cloud',
    'security',
  ])
  expect(requireTagsField({ tags: 'cloud, security' }, 'post')).toEqual([
    'cloud',
    'security',
  ])
  expect(() => requireTagsField({ tags: [] }, 'bad-post')).toThrow()
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

    expect(manifest).toMatch(/hardening-notes/)
    expect(manifest).toMatch(/Hardening Notes/)
    expect(manifest).toMatch(/Keep the boundary small/)
  } finally {
    await rm(blogDir, { force: true, recursive: true })
  }
})
