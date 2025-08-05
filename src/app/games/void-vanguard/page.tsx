import VoidVanguardGame from '@/components/games/void-vanguard';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const VoidVanguardPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main>
        <VoidVanguardGame />
      </main>
      <Footer />
    </div>
  );
};

export default VoidVanguardPage;
