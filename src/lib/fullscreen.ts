/** Toggle native browser fullscreen (requires a user gesture such as a button click). */
export async function toggleBrowserFullscreen(): Promise<void> {
  if (typeof document === "undefined") return;

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    /* Unsupported or denied by the browser */
  }
}
