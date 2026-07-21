import { ImageResponse } from 'next/og'
import { site } from '@/data/site'

export const alt = `${site.name} - ${site.label}`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#008080',
        color: '#000000',
        fontFamily: 'Arial, sans-serif',
        padding: 48,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#c0c0c0',
          borderTop: '6px solid #ffffff',
          borderLeft: '6px solid #ffffff',
          borderRight: '6px solid #000000',
          borderBottom: '6px solid #000000',
          boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 56,
            padding: '0 18px',
            background: 'linear-gradient(90deg, #000080, #1084d0)',
            color: '#ffffff',
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {site.website.pretty}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: '56px 64px',
          }}
        >
          <div
            style={{
              color: '#404040',
              fontSize: 28,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            {site.label}
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              maxWidth: 880,
              fontSize: 31,
              lineHeight: 1.25,
            }}
          >
            Backend systems, cloud infrastructure, CI/CD, and practical AI
            workflows.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 54,
            padding: '0 20px',
            background: '#c0c0c0',
            borderTop: '3px solid #808080',
            color: '#202020',
            fontSize: 24,
          }}
        >
          <span>{site.location}</span>
          <span>{site.email}</span>
        </div>
      </div>
    </div>,
    size
  )
}
