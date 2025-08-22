import type { Metadata } from 'next';
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Contact Us - Retro Arcade Zone',
  description: 'Get in touch with the Retro Arcade Zone team. We\'d love to hear from you!',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us - Retro Arcade Zone',
    description: 'Get in touch with the Retro Arcade Zone team. We\'d love to hear from you!',
    url: 'https://retroarcade.in/contact',
  },
  twitter: {
    title: 'Contact Us - Retro Arcade Zone',
    description: 'Get in touch with the Retro Arcade Zone team. We\'d love to hear from you!',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
