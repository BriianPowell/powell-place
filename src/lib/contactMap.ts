import { site } from "@/data/site";

export function getContactMapUrl(): string {
  const { lat, lng } = site.map;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05}%2C${lat - 0.03}%2C${lng + 0.05}%2C${lat + 0.03}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export const CONTACT_MAP_TITLE = `Map of ${site.map.label}`;
