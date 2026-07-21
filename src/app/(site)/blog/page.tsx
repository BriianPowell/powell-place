import type { Metadata } from 'next'
import { BlogListPage } from '@/components/content/BlogListPage'
import { site } from '@/data/site'
import { getAllBlogPosts } from '@/lib/blog'
import { getOpenGraphMetadata, getTwitterMetadata } from '@/lib/seo'

const description =
  'Engineering notes from Brian Powell on backend systems, cloud infrastructure, CI/CD, and software projects.'
const title = `${site.name} Blog`

export const metadata: Metadata = {
  title: 'Blog',
  description,
  alternates: {
    canonical: '/blog',
  },
  openGraph: getOpenGraphMetadata({
    title,
    description,
    url: '/blog',
  }),
  twitter: getTwitterMetadata({
    title,
    description,
  }),
}

export default function Blog() {
  return <BlogListPage posts={getAllBlogPosts()} />
}
