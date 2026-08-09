import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useContactDraft } from './useContactDraft'

const contactDraftKey = 'powell-place:contact-draft'

describe('useContactDraft', () => {
  afterEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('reads legacy drafts and rewrites updates with a saved timestamp', async () => {
    window.localStorage.setItem(
      contactDraftKey,
      JSON.stringify({
        email: 'test@example.com',
        fullname: 'Test User',
        message: 'Saved message',
      })
    )

    const { result } = renderHook(() => useContactDraft())

    await waitFor(() => {
      expect(result.current.draft.fullname).toBe('Test User')
    })

    act(() => {
      result.current.updateDraft('message', 'Updated message')
    })

    const storedDraft = JSON.parse(
      window.localStorage.getItem(contactDraftKey) ?? '{}'
    ) as { draft?: { message?: string }; savedAt?: string }

    expect(storedDraft.draft?.message).toBe('Updated message')
    expect(storedDraft.savedAt).toEqual(expect.any(String))
  })

  it('expires timestamped drafts after seven days', async () => {
    window.localStorage.setItem(
      contactDraftKey,
      JSON.stringify({
        draft: {
          email: 'test@example.com',
          fullname: 'Test User',
          message: 'Expired message',
        },
        savedAt: '2000-01-01T00:00:00.000Z',
      })
    )

    const { result } = renderHook(() => useContactDraft())

    await waitFor(() => {
      expect(result.current.draft).toEqual({
        email: '',
        fullname: '',
        message: '',
      })
    })
    expect(window.localStorage.getItem(contactDraftKey)).toBeNull()
  })

  it('continues when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    const { result } = renderHook(() => useContactDraft())

    await waitFor(() => {
      expect(result.current.draft.fullname).toBe('')
    })

    expect(() => {
      act(() => {
        result.current.updateDraft('fullname', 'Test User')
      })
    }).not.toThrow()
  })
})
