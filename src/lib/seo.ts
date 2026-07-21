import { site } from '@/data/site'

export const socialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${site.name} portfolio preview`,
}

export const seoKeywords = [
  'Brian Powell',
  'Software Engineer',
  'Backend Engineer',
  'Cloud Engineer',
  'AWS',
  'CI/CD',
  'Terraform',
  'Terragrunt',
  'Huntington Beach',
  'California',
]

export function getPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.label,
    description: site.description,
    email: `mailto:${site.email}`,
    url: site.website.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Huntington Beach',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    sameAs: site.profiles.map((profile) => profile.url),
    knowsAbout: site.services.map((service) => service.title),
  }
}
