import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PixelPaddle from '@/components/games/pixel-paddle';

export default function PixelPaddlePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PixelPaddle />
      </main>
      <Footer />
    </div>
  );
}
