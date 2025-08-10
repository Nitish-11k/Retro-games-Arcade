import type { Metadata, Viewport } from 'next';
import { Press_Start_2P, Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import './globals.css';

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-press-start-2p',
});

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://retroarcade.in'),
  title: {
    default: 'Retro Arcade Zone',
    template: '%s | Retro Arcade Zone',
  },
  description: 'Play free retro browser games like Tetris, Pac‑Man, Flappy Bird, Snake and more. No downloads. Just instant arcade fun!',
  keywords: [
    // Core & General
    'retro games',
    'arcade games',
    'classic arcade games',
    'old school games',
    'pixel games',
    '8-bit games',
    '90s games',
    'vintage games',
    'retro arcade games',
    'retro arcade zone',

    // Action & Intent
    'play online games',
    'free games',
    'browser games',
    'online games no download',
    'free online games',
    'games to play online',
    'instant play games',

    // Specific Games
    'tetris',
    'tetris online',
    'play tetris free',
    'pac-man',
    'pac-man online',
    'play pac-man free',
    'flappy bird',
    'flappy bird online',
    'play flappy bird free',
    'snake',
    'snake game',
    'play snake game',
    'mario',
    'mario runner',
    'platformer games',
    'pong',
    'pixel paddle',
    'space invaders',
    'void vanguard',
    'slither.io',
    'pixel slither',

    // Broader Arcade Terms
    'retro arcade',
    'retro arcade games',
    'retro arcade games online',
    'retro arcade games free',
    'online arcade',
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
    <html lang="en" className={`${pressStart2P.variable} ${fontSans.variable} dark scroll-smooth`}>
      <head>
        {/* The <link> tags for Google Fonts are no longer needed and will be removed. */}
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
