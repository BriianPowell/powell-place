import type { Metadata } from 'next'
import { ResumePage } from '@/components/content/ResumePage'
import { site } from '@/data/site'
import { socialImage } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume, work history, education, and certifications for Brian Powell, a software engineer focused on backend systems, cloud, and CI/CD.',
  alternates: {
    canonical: '/resume',
  },
  openGraph: {
    title: `${site.name} Resume`,
    description:
      'Work history, education, and certifications for Brian Powell, software engineer.',
    url: '/resume',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    images: [socialImage],
  },
}

export default function Resume() {
  return <ResumePage />
}
