import { site, tabs, type TabId } from "@/data/site";

/** Default toolbar Home / landing tab route. */
export const homeTabPath = tabs[0].path;

export function activeTabFromPath(pathname: string): TabId {
  if (pathname.startsWith("/resume")) return "resume";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname === "/" || pathname.startsWith("/about")) return "about";
  return "about";
}

function tabForId(id: TabId) {
  return tabs.find((t) => t.id === id);
}

/** Browser title bar — active tab label only. */
export function getBrowserTitle(active: TabId): string {
  return tabForId(active)?.label ?? site.name;
}

/** Taskbar application button — tab plus site name. */
export function getTaskbarAppLabel(active: TabId): string {
  const tab = tabForId(active);
  return tab ? `${tab.label} - ${site.name}` : site.name;
}
