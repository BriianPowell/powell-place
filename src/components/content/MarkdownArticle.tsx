import styles from './styles/blog.module.css'

export function MarkdownArticle({ contentHtml }: { contentHtml: string }) {
  return (
    <div
      className={styles.markdownArticle}
      // Blog HTML is compiled at build time from local, trusted Markdown files.
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  )
}
