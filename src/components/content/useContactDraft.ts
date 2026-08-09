'use client'

import { useEffect, useState } from 'react'

const contactDraftKey = 'powell-place:contact-draft'
const contactDraftTtlMs = 7 * 24 * 60 * 60 * 1000

type ContactDraft = {
  email: string
  fullname: string
  message: string
}

type StoredContactDraft = {
  draft?: Partial<ContactDraft>
  savedAt?: string
}

const emptyContactDraft: ContactDraft = {
  email: '',
  fullname: '',
  message: '',
}

function readContactDraft(): ContactDraft {
  const rawDraft = readStoredContactDraft()
  if (!rawDraft) return emptyContactDraft

  try {
    const parsedDraft = JSON.parse(rawDraft) as Partial<
      ContactDraft & StoredContactDraft
    >
    const savedAt =
      typeof parsedDraft.savedAt === 'string'
        ? Date.parse(parsedDraft.savedAt)
        : null

    if (
      savedAt !== null &&
      (Number.isNaN(savedAt) || Date.now() - savedAt > contactDraftTtlMs)
    ) {
      removeContactDraft()
      return emptyContactDraft
    }

    const draft = parsedDraft.draft ?? parsedDraft

    return {
      email: typeof draft.email === 'string' ? draft.email : '',
      fullname: typeof draft.fullname === 'string' ? draft.fullname : '',
      message: typeof draft.message === 'string' ? draft.message : '',
    }
  } catch {
    return emptyContactDraft
  }
}

function readStoredContactDraft() {
  try {
    return window.localStorage.getItem(contactDraftKey)
  } catch {
    return null
  }
}

function saveContactDraft(draft: ContactDraft) {
  try {
    window.localStorage.setItem(
      contactDraftKey,
      JSON.stringify({
        draft,
        savedAt: new Date().toISOString(),
      })
    )
  } catch {
    // Browsers can disable storage in private or hardened modes.
  }
}

function removeContactDraft() {
  try {
    window.localStorage.removeItem(contactDraftKey)
  } catch {
    // Browsers can disable storage in private or hardened modes.
  }
}

export function useContactDraft() {
  const [draft, setDraft] = useState<ContactDraft>(emptyContactDraft)

  useEffect(() => {
    setDraft(readContactDraft())
  }, [])

  const updateDraft = (field: keyof ContactDraft, value: string) => {
    setDraft((currentDraft) => {
      const nextDraft = {
        ...currentDraft,
        [field]: value,
      }

      saveContactDraft(nextDraft)
      return nextDraft
    })
  }

  const clearDraft = () => {
    removeContactDraft()
    setDraft(emptyContactDraft)
  }

  return {
    clearDraft,
    draft,
    updateDraft,
  }
}
