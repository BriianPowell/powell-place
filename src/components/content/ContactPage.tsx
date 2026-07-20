import { ContactForm } from './ContactForm'
import { ContactMapSlot } from './ContactMapSlot'
import styles from './styles/content.module.css'

export function ContactPage() {
  return (
    <article className={styles.main}>
      <header className={styles.section}>
        <h2>Contact</h2>
      </header>
      <section className={styles.section}>
        <ContactMapSlot />
      </section>
      <section className={styles.section}>
        <h3>Contact Form</h3>
        <ContactForm />
      </section>
    </article>
  )
}
