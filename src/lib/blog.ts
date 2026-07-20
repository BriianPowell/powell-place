import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')
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

type BlogFrontmatter = {
  title?: unknown
  description?: unknown
  date?: unknown
  tags?: unknown
}

function requireStringField(
  frontmatter: BlogFrontmatter,
  fieldName: keyof BlogFrontmatter,
  slug: string
): string {
  const value = frontmatter[fieldName]

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(
      `Blog post "${slug}" is missing required frontmatter field "${fieldName}"`
    )
  }

  return value.trim()
}

function requireDateField(frontmatter: BlogFrontmatter, slug: string): string {
  const value = frontmatter.date

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  throw new Error(
    `Blog post "${slug}" is missing required frontmatter field "date"`
  )
}

function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim())
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

function parseBlogPost(source: string, slug: string): Omit<BlogPost, 'slug'> {
  const { content, data } = matter(source)
  const frontmatter = data as BlogFrontmatter
  const contentHtml = remark().use(html).processSync(content).toString()

  return {
    title: requireStringField(frontmatter, 'title', slug),
    description: requireStringField(frontmatter, 'description', slug),
    date: requireDateField(frontmatter, slug),
    tags: parseTags(frontmatter.tags),
    contentHtml,
  }
}

function getPostSlugs(): string[] {
  if (!existsSync(BLOG_DIR)) return []

  return readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
}

export function getBlogPost(slug: string): BlogPost | null {
  if (!SLUG_PATTERN.test(slug)) return null

  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  if (!existsSync(filePath)) return null

  const parsed = parseBlogPost(readFileSync(filePath, 'utf8'), slug)

  return {
    slug,
    ...parsed,
  }
}

export function getAllBlogPosts(): BlogPostMeta[] {
  return getPostSlugs()
    .map(getBlogPost)
    .filter((post): post is BlogPost => post !== null)
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
  return getPostSlugs()
}
