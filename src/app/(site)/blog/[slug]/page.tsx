import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPostPage } from '@/components/content/BlogPostPage'
import { site } from '@/data/site'
import { getBlogPost, getBlogPostSlugs } from '@/lib/blog'
import { socialImage } from '@/lib/seo'

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | ${site.name}`,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      images: [socialImage],
    },
  }
}

export default async function BlogPost({ params }: BlogPostRouteProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostPage post={post} />
}
