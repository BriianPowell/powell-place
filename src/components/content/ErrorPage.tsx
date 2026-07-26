'use client'

import Link from 'next/link'
import styles from './styles/content.module.css'
import errorStyles from './styles/errorPage.module.css'

type ErrorPageKind = 'notFound' | 'unexpected'

type ErrorPageAction =
  | {
      href: string
      label: string
      type: 'link'
    }
  | {
      label: string
      type: 'reset'
    }

type ErrorPageContent = {
  actions: ErrorPageAction[]
  copy: string
  digits: string[]
  eyebrow: string
  navLabel: string
  status: string
  title: string
}

const errorContent = {
  notFound: {
    actions: [
      { href: '/about', label: 'About', type: 'link' },
      { href: '/resume', label: 'Resume', type: 'link' },
      { href: '/blog', label: 'Blog', type: 'link' },
      { href: '/contact', label: 'Contact', type: 'link' },
    ],
    copy: 'The page you rolled for is not in this directory. It may have moved, despawned, or never shipped.',
    digits: ['4', '0', '4'],
    eyebrow: 'Rare error encountered',
    navLabel: '404 recovery links',
    status:
      'Explorer looked everywhere it knows about and came back empty-handed.',
    title: 'Page not found',
  },
  unexpected: {
    actions: [
      { label: 'Try again', type: 'reset' },
      { href: '/about', label: 'About', type: 'link' },
      { href: '/contact', label: 'Contact', type: 'link' },
    ],
    copy: 'Something inside this little browser crashed. Try again, or head back to a known-good page.',
    digits: ['5', '0', '0'],
    eyebrow: 'System error encountered',
    navLabel: 'Error recovery links',
    status:
      'The application hit an unexpected error and could not finish loading this view.',
    title: 'Application error',
  },
} satisfies Record<ErrorPageKind, ErrorPageContent>

export function ErrorPage({
  kind,
  reset,
}: {
  kind: ErrorPageKind
  reset?: () => void
}) {
  const content = errorContent[kind]

  return (
    <article className={styles.main}>
      <section className={errorStyles.panel}>
        <div className={errorStyles.hero}>
          <p className={errorStyles.eyebrow}>{content.eyebrow}</p>
          <h2 className={errorStyles.srOnly}>{content.title}</h2>
          <div className={errorStyles.errorGraphic} aria-hidden>
            <div className={errorStyles.digits}>
              {content.digits.map((digit, index) => (
                <span key={`${digit}-${index}`}>{digit}</span>
              ))}
            </div>
            <span className={errorStyles.title}>{content.title}</span>
          </div>
          <p className={errorStyles.copy}>{content.copy}</p>
        </div>
        <div className={errorStyles.statusBox}>
          <span className={errorStyles.statusIcon} aria-hidden>
            !
          </span>
          <p>{content.status}</p>
        </div>
        <nav aria-label={content.navLabel}>
          <ul className={errorStyles.linkList}>
            {content.actions.map((action) => (
              <li key={action.label}>
                {action.type === 'reset' ? (
                  <button
                    className={`${errorStyles.link} win98Button`}
                    onClick={reset}
                    type="button"
                  >
                    {action.label}
                  </button>
                ) : (
                  <Link
                    className={`${errorStyles.link} win98Button`}
                    href={action.href}
                  >
                    {action.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </article>
  )
}
