import { icons } from '@/lib/icons'
import styles from './styles/browserStatus.module.css'

export function StatusZoneNetworkIcon() {
  return (
    <img
      src={icons.earth}
      alt=""
      className={styles.statusZoneIcon}
      width={16}
      height={16}
      decoding="async"
    />
  )
}
