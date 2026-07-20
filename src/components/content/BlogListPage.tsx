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
            <h3>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className={styles.timelineMeta}>
              <time dateTime={post.date}>{post.date}</time>
              {post.tags.length > 0 && <> · {post.tags.join(', ')}</>}
            </p>
            <p>{post.description}</p>
          </li>
        ))}
      </ol>
    </article>
  )
}
