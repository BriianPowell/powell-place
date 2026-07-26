import { BrowserShell } from '@/components/browser/BrowserShell'
import { NotFoundPage } from '@/components/content/NotFoundPage'
import { DesktopShell } from '@/components/desktop/DesktopShell'
import { Taskbar } from '@/components/desktop/Taskbar'

export default function NotFound() {
  return (
    <DesktopShell>
      <BrowserShell>
        <NotFoundPage />
      </BrowserShell>
      <Taskbar />
    </DesktopShell>
  )
}
