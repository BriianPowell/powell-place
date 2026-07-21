import type { Metadata } from 'next'
import { BlogListPage } from '@/components/content/BlogListPage'
import { site } from '@/data/site'
import { getAllBlogPosts } from '@/lib/blog'
import { socialImage } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Engineering notes from Brian Powell on backend systems, cloud infrastructure, CI/CD, and software projects.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: `${site.name} Blog`,
    description:
      'Engineering notes from Brian Powell on backend systems, cloud infrastructure, CI/CD, and software projects.',
    url: '/blog',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    images: [socialImage],
  },
}

export default function Blog() {
  return <BlogListPage posts={getAllBlogPosts()} />
}
