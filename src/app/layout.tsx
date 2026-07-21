import type { Metadata } from 'next'
import { FaviconAnimator } from '@/components/FaviconAnimator'
import { site } from '@/data/site'
import { icons } from '@/lib/icons'
import { getPersonJsonLd, seoKeywords, socialImage } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.label}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.website.url),
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.website.url }],
  creator: site.name,
  publisher: site.name,
  keywords: seoKeywords,
  alternates: {
    canonical: '/about',
  },
  icons: {
    icon: icons.joystick[0],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: `${site.name} | ${site.label}`,
    description: site.description,
    url: site.website.url,
    siteName: site.name,
    locale: 'en_US',
    type: 'profile',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | ${site.label}`,
    description: site.description,
    images: [socialImage],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={icons.joystick[0]} />
        <link rel="shortcut icon" href={icons.joystick[0]} />
      </head>
      <body>
        <FaviconAnimator />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getPersonJsonLd()),
          }}
        />
        <div className="desktop-backdrop" aria-hidden />
        {children}
      </body>
    </html>
  )
}
