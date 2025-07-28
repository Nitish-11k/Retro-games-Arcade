import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import GameGallery from '@/components/sections/game-gallery';
import Leaderboards from '@/components/sections/leaderboards';
import AiRecommender from '@/components/sections/ai-recommender';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <GameGallery />
        <section id="recommender" className="py-16">
           <AiRecommender />
        </section>
        <section id="leaderboard" className="py-16">
          <Leaderboards />
        </section>
      </main>
      <Footer />
    </div>
  );
}
