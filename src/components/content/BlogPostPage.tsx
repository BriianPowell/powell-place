import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'
import { MarkdownArticle } from './MarkdownArticle'
import blogStyles from './styles/blog.module.css'
import styles from './styles/content.module.css'

export function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <article className={styles.main}>
      <header className={blogStyles.blogHeader}>
        <Link href="/blog" className={blogStyles.backLink}>
          &lt; Back to Blog
        </Link>
        <h2>{post.title}</h2>
        <div className={blogStyles.postMeta}>
          <time className={blogStyles.metaBadge} dateTime={post.date}>
            {post.date}
          </time>
          {post.tags.length > 0 && (
            <ul className={blogStyles.tagList} aria-label="Post tags">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </div>
        <p>{post.description}</p>
      </header>
      <MarkdownArticle contentHtml={post.contentHtml} />
    </article>
  )
}
