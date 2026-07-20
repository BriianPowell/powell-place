import { site } from '@/data/site'

const TILE_SIZE = 256
const VIEWPORT_WIDTH = 768
const VIEWPORT_HEIGHT = 320
const VIEWPORT_CENTER_OFFSET_Y = -115
const ZOOM = 13

export type ContactMapTile = {
  key: string
  left: number
  top: number
  url: string
}

function projectToWorldPixels({ lat, lng }: { lat: number; lng: number }) {
  const latRad = (lat * Math.PI) / 180
  const scale = 2 ** ZOOM * TILE_SIZE

  return {
    x: ((lng + 180) / 360) * scale,
    y:
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      scale,
  }
}

export function getContactMapTiles(): ContactMapTile[] {
  const { lat, lng } = site.map
  const center = projectToWorldPixels({ lat, lng })
  const topLeft = {
    x: center.x - VIEWPORT_WIDTH / 2,
    y: center.y - VIEWPORT_HEIGHT / 2 + VIEWPORT_CENTER_OFFSET_Y,
  }
  const minTileX = Math.floor(topLeft.x / TILE_SIZE)
  const maxTileX = Math.floor((topLeft.x + VIEWPORT_WIDTH) / TILE_SIZE)
  const minTileY = Math.floor(topLeft.y / TILE_SIZE)
  const maxTileY = Math.floor((topLeft.y + VIEWPORT_HEIGHT) / TILE_SIZE)
  const tileCount = 2 ** ZOOM
  const tiles: ContactMapTile[] = []

  for (let x = minTileX; x <= maxTileX; x += 1) {
    for (let y = minTileY; y <= maxTileY; y += 1) {
      const wrappedX = ((x % tileCount) + tileCount) % tileCount

      tiles.push({
        key: `${x}-${y}`,
        left: x * TILE_SIZE - topLeft.x,
        top: y * TILE_SIZE - topLeft.y,
        url: `https://tile.openstreetmap.org/${ZOOM}/${wrappedX}/${y}.png`,
      })
    }
  }

  return tiles
}

export const CONTACT_MAP_TITLE = `Map of ${site.map.label}`
