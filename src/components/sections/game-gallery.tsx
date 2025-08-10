import PixelSlitherCard from '@/components/games/pixel-slither-card';
import PixelPaddleCard from '@/components/games/pixel-paddle-card';
import FlappyBirdCard from '@/components/games/flappy-bird-card';
import TetrisCard from '@/components/games/tetris-card';
import PacManCard from '@/components/games/pac-man-card';
import VoidVanguardCard from '@/components/games/void-vanguard-card';
import MarioRunnerCard from '@/components/games/mario-runner-card';

const GameGallery = () => {
  return (
    <section id="games" className="py-16">
      <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Choose Your Challenge</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Featured Games */}
        <div className="sm:col-span-2 lg:col-span-1">
          <PixelSlitherCard />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <PixelPaddleCard />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <FlappyBirdCard />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <TetrisCard />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <PacManCard />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <VoidVanguardCard />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <MarioRunnerCard />
        </div>
      </div>
    </section>
  );
};

export default GameGallery;
