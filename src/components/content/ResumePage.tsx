import { site, type TimelineEntry } from "@/data/site";
import styles from "./content.module.css";

function TimelineSection({
  title,
  entries,
}: {
  title: string;
  entries: TimelineEntry[];
}) {
  return (
    <section className={styles.timeline}>
      <h3>{title}</h3>
      <ol className={styles.timelineList}>
        {entries.map((entry) => (
          <li key={`${entry.organization}-${entry.duration}`} className={styles.timelineItem}>
            <h4>{entry.organization}</h4>
            <p className={styles.timelineMeta}>
              <strong>{entry.title}</strong> · {entry.duration}
            </p>
            {entry.bullets.length > 0 && (
              <ul className={styles.timelineBullets}>
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ResumePage() {
  return (
    <article className={styles.main}>
      <header className={styles.section}>
        <h2>Resume</h2>
      </header>
      <TimelineSection title="Experience" entries={site.experience} />
      <TimelineSection title="Education" entries={site.education} />
      <section className={styles.timeline}>
        <h3>Certificates</h3>
        <ol className={styles.timelineList}>
          {site.certificates.map((cert) => (
            <li key={cert.title} className={styles.timelineItem}>
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
  );
}
