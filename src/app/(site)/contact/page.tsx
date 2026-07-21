import type { Metadata } from 'next'
import { ContactPage } from '@/components/content/ContactPage'
import { site } from '@/data/site'
import { getOpenGraphMetadata, getTwitterMetadata } from '@/lib/seo'

const description =
  'Contact Brian Powell for software engineering, backend, cloud, CI/CD, and frontend architecture opportunities.'
const socialDescription =
  'Contact Brian Powell for software engineering and cloud engineering opportunities.'
const title = `Contact ${site.name}`

export const metadata: Metadata = {
  title: 'Contact',
  description,
  alternates: {
    canonical: '/contact',
  },
  openGraph: getOpenGraphMetadata({
    title,
    description: socialDescription,
    url: '/contact',
  }),
  twitter: getTwitterMetadata({
    title,
    description: socialDescription,
  }),
}

export default function Contact() {
  return <ContactPage />
}
