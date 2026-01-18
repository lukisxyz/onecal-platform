import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import coinbaseCss from '@coinbase/onchainkit/styles.css?url';
import { Providers } from '@/provider'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'OneCal - Blockchain-Powered Mentorship Booking',
      },
      {
        name: 'description',
        content: 'OneCal revolutionizes mentorship and consultation booking with blockchain-powered payments. Built on Base Network, our platform enables seamless scheduling while the innovative commitment fee system ensures both mentors and mentees show up prepared, reducing no-shows through skin-in-the-game economics.',
      },
      {
        name: 'theme-color',
        content: '#2563eb',
      },
      {
        name: 'application-name',
        content: 'OneCal',
      },
      // Open Graph / Facebook
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://onecal.app/',
      },
      {
        property: 'og:title',
        content: 'OneCal - Blockchain-Powered Mentorship Booking',
      },
      {
        property: 'og:description',
        content: 'Revolutionary mentorship platform with blockchain-powered payments and commitment-based booking to eliminate no-shows.',
      },
      {
        property: 'og:image',
        content: '/icons/og-image.png',
      },
      // Twitter
      {
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'twitter:url',
        content: 'https://onecal.app/',
      },
      {
        property: 'twitter:title',
        content: 'OneCal - Blockchain-Powered Mentorship Booking',
      },
      {
        property: 'twitter:description',
        content: 'Revolutionary mentorship platform with blockchain-powered payments and commitment-based booking to eliminate no-shows.',
      },
      {
        property: 'twitter:image',
        content: '/icons/og-image.png',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'stylesheet',
        href: coinbaseCss,
      },
      // Favicons
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/favicon-96x96.png',
      },
      // Apple Touch Icons
      {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        href: '/apple-icon-57x57.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        href: '/apple-icon-60x60.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        href: '/apple-icon-72x72.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: '/apple-icon-76x76.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: '/apple-icon-114x114.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: '/apple-icon-120x120.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: '/apple-icon-144x144.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/apple-icon-152x152.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-icon-180x180.png',
      },
      // Android/Chrome Icons
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '36x36',
        href: '/android-icon-36x36.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/android-icon-48x48.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '72x72',
        href: '/android-icon-72x72.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/android-icon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '144x144',
        href: '/android-icon-144x144.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/android-icon-192x192.png',
      },
      // Microsoft Tiles
      {
        rel: 'msapplication-TileImage',
        content: '/ms-icon-144x144.png',
      },
      {
        rel: 'msapplication-TileColor',
        content: '#2563eb',
      },
      // PWA Manifest
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
