import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test } from 'vitest'

async function readProjectFile(relativePath) {
  return readFile(path.join(process.cwd(), relativePath), 'utf8')
}

test('contact drafts are timestamped and expire', async () => {
  const draftHook = await readProjectFile(
    'src/components/content/useContactDraft.ts'
  )

  expect(draftHook).toMatch(/contactDraftTtlMs/)
  expect(draftHook).toMatch(/savedAt/)
  expect(draftHook).toMatch(/Date\.now\(\) - savedAt > contactDraftTtlMs/)
})

test('contact localStorage access tolerates storage failures', async () => {
  const draftHook = await readProjectFile(
    'src/components/content/useContactDraft.ts'
  )
  const contactForm = await readProjectFile(
    'src/components/content/ContactForm.tsx'
  )

  expect(draftHook).toMatch(/readStoredContactDraft/)
  expect(draftHook).toMatch(/catch \{\n    return null/)
  expect(contactForm).toMatch(/catch \{\n    return false/)
  expect(contactForm).toMatch(/Browsers can disable storage/)
})
