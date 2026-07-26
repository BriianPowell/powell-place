'use client'

import { BrowserShell } from '@/components/browser/BrowserShell'
import { ErrorPage } from '@/components/content/ErrorPage'
import { DesktopShell } from '@/components/desktop/DesktopShell'
import { Taskbar } from '@/components/desktop/Taskbar'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <DesktopShell>
      <BrowserShell>
        <ErrorPage kind="unexpected" reset={reset} />
      </BrowserShell>
      <Taskbar />
    </DesktopShell>
  )
}
