'use client'

import { useEffect, useState } from 'react'

const contactDraftKey = 'powell-place:contact-draft'

export type ContactDraft = {
  email: string
  fullname: string
  message: string
}

const emptyContactDraft: ContactDraft = {
  email: '',
  fullname: '',
  message: '',
}

function readContactDraft(): ContactDraft {
  const rawDraft = window.localStorage.getItem(contactDraftKey)
  if (!rawDraft) return emptyContactDraft

  try {
    const draft = JSON.parse(rawDraft) as Partial<ContactDraft>

    return {
      email: typeof draft.email === 'string' ? draft.email : '',
      fullname: typeof draft.fullname === 'string' ? draft.fullname : '',
      message: typeof draft.message === 'string' ? draft.message : '',
    }
  } catch {
    return emptyContactDraft
  }
}

function saveContactDraft(draft: ContactDraft) {
  window.localStorage.setItem(contactDraftKey, JSON.stringify(draft))
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

  return {
    draft,
    updateDraft,
  }
}
