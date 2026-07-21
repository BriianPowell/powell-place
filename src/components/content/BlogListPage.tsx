import Link from 'next/link'
import type { BlogPostMeta } from '@/lib/blog'
import blogStyles from './styles/blog.module.css'
import styles from './styles/content.module.css'

export function BlogListPage({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <article className={styles.main}>
      <header className={styles.section}>
        <h2>Blog</h2>
        <p>
          Notes on engineering, cloud infrastructure, and projects I am working
          through.
        </p>
      </header>
      <ol className={blogStyles.blogList}>
        {posts.map((post) => (
          <li key={post.slug} className={blogStyles.blogCard}>
            <div className={blogStyles.blogCardHeader}>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <time className={blogStyles.metaBadge} dateTime={post.date}>
                {post.date}
              </time>
            </div>
            {post.tags.length > 0 && (
              <ul className={blogStyles.tagList} aria-label="Post tags">
                {post.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
            <p>{post.description}</p>
          </li>
        ))}
      </ol>
    </article>
  )
}
