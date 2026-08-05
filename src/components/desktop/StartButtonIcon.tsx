import { icons } from '@/lib/icons'
import styles from './styles/taskbar.module.css'

export function StartButtonIcon() {
  return (
    <img
      src={icons.w95}
      alt=""
      className={styles.startIconImg}
      width={26}
      height={26}
      decoding="async"
    />
  )
}
