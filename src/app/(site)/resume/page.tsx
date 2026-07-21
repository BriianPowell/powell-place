import type { Metadata } from 'next'
import { ResumePage } from '@/components/content/ResumePage'
import { site } from '@/data/site'
import { getOpenGraphMetadata, getTwitterMetadata } from '@/lib/seo'

const description =
  'Resume, work history, education, and certifications for Brian Powell, a software engineer focused on backend systems, cloud, and CI/CD.'
const socialDescription =
  'Work history, education, and certifications for Brian Powell, software engineer.'
const title = `${site.name} Resume`

export const metadata: Metadata = {
  title: 'Resume',
  description,
  alternates: {
    canonical: '/resume',
  },
  openGraph: getOpenGraphMetadata({
    title,
    description: socialDescription,
    url: '/resume',
  }),
  twitter: getTwitterMetadata({
    title,
    description: socialDescription,
  }),
}

export default function Resume() {
  return <ResumePage />
}
