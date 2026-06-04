import { site } from "@/data/site";

export function getAddressForPath(pathname: string): string {
  const base = site.website.url.replace(/\/$/, "");
  if (pathname === "/") return `${base}/about`;
  return `${base}${pathname}`;
}
