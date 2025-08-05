
import PacManGame from '@/components/games/pac-man';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const PacManPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8 flex justify-center">
        <PacManGame />
      </main>
      <Footer />
    </div>
  );
};

export default PacManPage;
