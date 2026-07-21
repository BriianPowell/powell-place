import type { CSSProperties } from 'react'
import { site } from '@/data/site'
import aboutStyles from './styles/about.module.css'
import styles from './styles/content.module.css'

type ServiceAccentStyle = CSSProperties & {
  '--service-accent': string
  '--service-wash': string
}

function getServiceAccentStyle({
  accent,
  wash,
}: {
  accent: string
  wash: string
}): ServiceAccentStyle {
  return {
    '--service-accent': accent,
    '--service-wash': wash,
  }
}

export function AboutPage() {
  return (
    <article className={`${styles.main} ${aboutStyles.aboutPage}`}>
      <header className={`${styles.section} ${aboutStyles.hero}`}>
        <p className={aboutStyles.eyebrow}>{site.name}</p>
        <h2>About me</h2>
        <div className={aboutStyles.heroCopy}>
          <p>{site.bio.p1}</p>
          <p>{site.bio.p2}</p>
        </div>
      </header>
      <section className={`${styles.section} ${aboutStyles.focusSection}`}>
        <div className={aboutStyles.sectionHeader}>
          <h3>Focus & Collaboration</h3>
          <p>Where I tend to create the most leverage across teams.</p>
        </div>
        <ul className={aboutStyles.serviceGrid}>
          {site.services.map((service) => (
            <li
              key={service.title}
              className={aboutStyles.serviceCard}
              style={getServiceAccentStyle(service)}
            >
              <span className={aboutStyles.serviceIconWrap} aria-hidden="true">
                <img
                  className={aboutStyles.serviceIcon}
                  src={service.icon}
                  alt=""
                  draggable={false}
                />
              </span>
              <div>
                <h4>{service.title}</h4>
                <p>{service.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
