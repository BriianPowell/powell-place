'use client'

import { ErrorPage } from '@/components/content/ErrorPage'

export default function Error({ reset }: { reset: () => void }) {
  return <ErrorPage kind="unexpected" reset={reset} />
}
