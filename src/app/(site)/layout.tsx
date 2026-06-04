import { BrowserShell } from "@/components/browser/BrowserShell";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { Taskbar } from "@/components/desktop/Taskbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DesktopShell>
      <BrowserShell>{children}</BrowserShell>
      <Taskbar />
    </DesktopShell>
  );
}
