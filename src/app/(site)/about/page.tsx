import type { Metadata } from 'next'
import { AboutPage } from '@/components/content/AboutPage'
import { site } from '@/data/site'
import { getOpenGraphMetadata, getTwitterMetadata } from '@/lib/seo'

const title = `About ${site.name}`

export const metadata: Metadata = {
  title: 'About',
  description: site.description,
  alternates: {
    canonical: '/about',
  },
  openGraph: getOpenGraphMetadata({
    title,
    description: site.description,
    url: '/about',
  }),
  twitter: getTwitterMetadata({
    title,
    description: site.description,
  }),
}

export default function About() {
  return <AboutPage />
}
