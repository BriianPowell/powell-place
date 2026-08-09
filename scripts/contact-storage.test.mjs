import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

async function readProjectFile(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('contact drafts are timestamped and expire', async () => {
  const draftHook = await readProjectFile(
    'src/components/content/useContactDraft.ts'
  )

  assert.match(draftHook, /contactDraftTtlMs/)
  assert.match(draftHook, /savedAt/)
  assert.match(draftHook, /Date\.now\(\) - savedAt > contactDraftTtlMs/)
})

test('contact localStorage access tolerates storage failures', async () => {
  const draftHook = await readProjectFile(
    'src/components/content/useContactDraft.ts'
  )
  const contactForm = await readProjectFile(
    'src/components/content/ContactForm.tsx'
  )

  assert.match(draftHook, /readStoredContactDraft/)
  assert.match(draftHook, /catch \{\n    return null/)
  assert.match(contactForm, /catch \{\n    return false/)
  assert.match(contactForm, /Browsers can disable storage/)
})
