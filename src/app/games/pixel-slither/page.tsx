import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PixelSlither from '@/components/games/pixel-slither';

export default function PixelSlitherPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PixelSlither />
      </main>
      <Footer />
    </div>
  );
}
