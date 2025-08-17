import { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Contact Us - Retro Arcade Zone',
  description: 'Get in touch with the Retro Arcade Zone team. We\'d love to hear from you!',
  keywords: 'contact, retro arcade, gaming, support, feedback',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
