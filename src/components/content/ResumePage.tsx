import { site, type TimelineEntry } from '@/data/site'
import styles from './styles/content.module.css'
import resumeStyles from './styles/resume.module.css'

function TimelineSection({
  title,
  entries,
}: {
  title: string
  entries: TimelineEntry[]
}) {
  return (
    <section className={resumeStyles.timeline}>
      <h3>{title}</h3>
      <ol className={resumeStyles.timelineList}>
        {entries.map((entry) => (
          <li
            key={`${entry.organization}-${entry.duration}`}
            className={resumeStyles.timelineItem}
          >
            <h4>{entry.organization}</h4>
            <p className={styles.timelineMeta}>
              <strong>{entry.title}</strong> · {entry.duration}
            </p>
            {entry.bullets.length > 0 && (
              <ul className={resumeStyles.timelineBullets}>
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function ResumePage() {
  return (
    <article className={styles.main}>
      <header className={styles.section}>
        <h2>Resume</h2>
      </header>
      <TimelineSection title="Experience" entries={site.experience} />
      <TimelineSection title="Education" entries={site.education} />
      <section className={resumeStyles.timeline}>
        <h3>Certificates</h3>
        <ol className={resumeStyles.timelineList}>
          {site.certificates.map((cert) => (
            <li key={cert.title} className={resumeStyles.timelineItem}>
              <h4>
                <a href={cert.link} target="_blank" rel="noreferrer">
                  {cert.title}
                </a>
              </h4>
              <p className={styles.timelineMeta}>
                <strong>{cert.organization}</strong>
              </p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
