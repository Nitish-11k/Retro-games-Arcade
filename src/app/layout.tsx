import type { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://retroarcade.in'),
  title: {
    default: 'Retro Arcade Zone',
    template: '%s | Retro Arcade Zone',
  },
  description: 'Play free retro browser games like Tetris, Pac‑Man, Flappy Bird, Snake and more. No downloads. Just instant arcade fun!',
  keywords: [
    'retro games',
    'retro arcade',
    'retro arcade games',
    'retro arcade games online',
    'retro arcade games free',
    'browser games',
    'free games',
    'tetris online',
    'pac-man online',
    'flappy bird online',
    'snake game',
    'arcade games',
    'play online games',
    'pixel games'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://retroarcade.in',
    title: 'Retro Arcade Zone',
    description: 'Pixel Power Meets Endless Play · Play free retro browser games instantly.',
    siteName: 'Retro Arcade Zone',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retro Arcade Zone',
    description: 'Play free retro browser games instantly.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Retro Arcade Zone',
              url: 'https://retroarcade.in',
              logo: 'https://retroarcade.in/favicon.ico',
              sameAs: [
                // Add your social profiles when available
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Retro Arcade Zone',
              url: 'https://retroarcade.in',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://retroarcade.in/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
         <script
           async
           src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7695636367145795"
           crossOrigin="anonymous"
         ></script>
        {/* Preload hero font weight if needed (kept minimal) */}
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
