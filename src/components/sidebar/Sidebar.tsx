import { site } from "@/data/site";
import styles from "./sidebar.module.css";

type SidebarProps = {
  /** Render inside the desktop profile panel (no side border). */
  embedded?: boolean;
};

export function Sidebar({ embedded = false }: SidebarProps) {
  const initials = site.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <aside className={embedded ? `${styles.sidebar} ${styles.embedded}` : styles.sidebar}>
      <div className={styles.avatar} aria-hidden>
        {initials}
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
          <p className={styles.contactLabel}>Phone</p>
          <a href={`tel:${site.phone.replace(/\./g, "")}`} className={styles.contactValue}>
            {site.phone}
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
              className={styles.socialLink}
            >
              {profile.network}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
