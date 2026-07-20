import type { MetadataRoute } from 'next'
import { site, tabs } from '@/data/site'
import { getAllBlogPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const tabRoutes = tabs.map((tab) => ({
    url: `${site.website.url}${tab.path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: tab.id === 'about' ? 1 : 0.8,
  }))

  const blogRoutes = getAllBlogPosts().map((post) => ({
    url: `${site.website.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...tabRoutes, ...blogRoutes]
}
