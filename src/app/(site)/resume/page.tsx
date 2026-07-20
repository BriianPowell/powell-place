import type { Metadata } from 'next'
import { ResumePage } from '@/components/content/ResumePage'
import { site } from '@/data/site'

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
  },
}

export default function Resume() {
  return <ResumePage />
}
