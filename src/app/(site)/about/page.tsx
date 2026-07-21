import type { Metadata } from 'next'
import { AboutPage } from '@/components/content/AboutPage'
import { site } from '@/data/site'
import { socialImage } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'About',
  description: site.description,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `About ${site.name}`,
    description: site.description,
    url: '/about',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    images: [socialImage],
  },
}

export default function About() {
  return <AboutPage />
}
