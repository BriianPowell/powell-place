import { icons } from '@/lib/icons'
import styles from './styles/browserStatus.module.css'

export function StatusPageWebIcon() {
  return (
    <img
      src={icons.html}
      alt=""
      className={styles.statusPaneIconImg}
      width={16}
      height={16}
      decoding="async"
    />
  )
}
