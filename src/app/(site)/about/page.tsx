import type { Metadata } from 'next'
import { AboutPage } from '@/components/content/AboutPage'
import { site } from '@/data/site'

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
  },
}

export default function About() {
  return <AboutPage />
}
