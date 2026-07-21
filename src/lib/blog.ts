import { blogPosts } from '@/content/blog/manifest'

const SLUG_PATTERN = /^[a-z0-9-]+$/

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
}

export type BlogPost = BlogPostMeta & {
  contentHtml: string
}

export function getBlogPost(slug: string): BlogPost | null {
  if (!SLUG_PATTERN.test(slug)) return null

  return blogPosts.find((post) => post.slug === slug) ?? null
}

export function getAllBlogPosts(): BlogPostMeta[] {
  return [...blogPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ date, description, slug, tags, title }) => ({
      date,
      description,
      slug,
      tags,
      title,
    }))
}

export function getBlogPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug)
}
