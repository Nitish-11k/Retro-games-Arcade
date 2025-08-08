import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import RedBallGame from '@/components/games/red-ball';

export default function RedBallPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <RedBallGame />
      </main>
      <Footer />
    </div>
  );
}


