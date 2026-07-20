import { site } from '@/data/site'
import aboutStyles from './styles/about.module.css'
import styles from './styles/content.module.css'

export function AboutPage() {
  return (
    <article className={styles.main}>
      <header className={styles.section}>
        <h2>About me</h2>
      </header>
      <section className={styles.section}>
        <p>{site.bio.p1}</p>
        <p>{site.bio.p2}</p>
      </section>
      <section className={styles.section}>
        <h3>What I&apos;m doing</h3>
        <ul className={aboutStyles.serviceGrid}>
          {site.services.map((service) => (
            <li key={service.title} className={aboutStyles.serviceCard}>
              <h4>{service.title}</h4>
              <p>{service.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
