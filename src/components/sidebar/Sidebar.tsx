import { site } from '@/data/site'
import styles from './styles/sidebar.module.css'

type SidebarProps = {
  /** Render inside the desktop profile panel (no side border). */
  embedded?: boolean
}

export function Sidebar({ embedded = false }: SidebarProps) {
  return (
    <aside
      className={
        embedded ? `${styles.sidebar} ${styles.embedded}` : styles.sidebar
      }
    >
      <div className={styles.avatar} aria-hidden>
        <img
          className={styles.avatarImage}
          src="/icons/avatar1_win98.png"
          alt=""
          draggable={false}
        />
      </div>
      <div>
        <h1 className={styles.name}>{site.name}</h1>
        <p className={styles.label}>{site.label}</p>
      </div>

      <div className={styles.divider} />

      <ul className={styles.contactList}>
        <li className={styles.contactItem}>
          <p className={styles.contactLabel}>Email</p>
          <a href={`mailto:${site.email}`} className={styles.contactValue}>
            {site.email}
          </a>
        </li>
        <li className={styles.contactItem}>
          <p className={styles.contactLabel}>Zodiac</p>
          <span className={styles.contactValue}>{site.sign}</span>
        </li>
        <li className={styles.contactItem}>
          <p className={styles.contactLabel}>Location</p>
          <address className={styles.contactValue}>{site.location}</address>
        </li>
      </ul>

      <div className={styles.divider} />

      <ul className={styles.socialList}>
        {site.profiles.map((profile) => (
          <li key={profile.network}>
            <a
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              className={`${styles.socialLink} win98Button`}
            >
              {profile.network}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
