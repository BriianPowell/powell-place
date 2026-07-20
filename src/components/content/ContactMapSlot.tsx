import { CONTACT_MAP_TITLE, getContactMapTiles } from '@/lib/contactMap'
import styles from './styles/contactMap.module.css'

export function ContactMapSlot() {
  const tiles = getContactMapTiles()

  return (
    <figure className={styles.mapHost} aria-label={CONTACT_MAP_TITLE}>
      <div className={styles.mapTiles} aria-hidden>
        {tiles.map((tile) => (
          <img
            key={tile.key}
            className={styles.mapTile}
            src={tile.url}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ left: tile.left, top: tile.top }}
          />
        ))}
      </div>
    </figure>
  )
}
