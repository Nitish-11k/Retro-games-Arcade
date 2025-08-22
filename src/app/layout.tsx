import type { Metadata, Viewport } from 'next';
import { Press_Start_2P, Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { EmailJSProvider } from '@/components/emailjs-provider';
import { PerformanceMonitor } from '@/components/performance-monitor';
import './globals.css';

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-press-start-2p',
  preload: true,
  fallback: ['monospace'],
});

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://retroarcade.in'),
  title: {
    default: 'Retro Arcade Zone',
    template: '%s | Retro Arcade Zone',
  },
  description: 'Play free retro browser games instantly. Enjoy classics like Tetris, Pac-Man, and Snake right in your browser—no downloads required.',
  keywords: [
    'retro games', 'arcade games', 'classic games', 'free games', 'browser games',
    'tetris', 'pac-man', 'flappy bird', 'snake', 'online games'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://retroarcade.in',
    title: 'Retro Arcade Zone',
    description: 'Play free retro browser games instantly.',
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
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data: Organization - Simplified */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Retro Arcade Zone',
              url: 'https://retroarcade.in',
              description: 'Play free retro browser games instantly',
            }),
          }}
        />
        
        {/* Google AdSense - Load asynchronously */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7695636367145795"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <EmailJSProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </EmailJSProvider>
        <Toaster />
        <PerformanceMonitor />
      </body>
    </html>
  );
}
