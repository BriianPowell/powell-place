import type { Metadata } from 'next'
import { ContactPage } from '@/components/content/ContactPage'
import { site } from '@/data/site'
import { socialImage } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Brian Powell for software engineering, backend, cloud, CI/CD, and frontend architecture opportunities.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: `Contact ${site.name}`,
    description:
      'Contact Brian Powell for software engineering and cloud engineering opportunities.',
    url: '/contact',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    images: [socialImage],
  },
}

export default function Contact() {
  return <ContactPage />
}
