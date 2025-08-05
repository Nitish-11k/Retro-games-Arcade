
import type { Game } from '@/lib/types';
import GameCard from '@/components/game-card';
import { GameModal } from '@/components/game-modal';
import AdPlaceholder from '@/components/ad-placeholder';
import PixelSlitherCard from '@/components/games/pixel-slither-card';
import PixelPaddleCard from '@/components/games/pixel-paddle-card';
import FlappyBirdCard from '@/components/games/flappy-bird-card';
import TetrisCard from '@/components/games/tetris-card';
import PacManCard from '@/components/games/pac-man-card';
import VoidVanguardCard from '@/components/games/void-vanguard-card';

const games: Game[] = [
  { id: 'flappy-pixel', title: 'Flappy Pixel', description: 'Flap your way through the pixel pipes!', image: 'https://placehold.co/300x200.png', dataAiHint: 'flappy bird retro', instructions: 'Click the mouse or press the spacebar to make the bird jump. Avoid the pipes!' },
  { id: 'block-stacker', title: 'Block Stacker', description: 'Align the falling blocks to clear lines.', image: 'https://placehold.co/300x200.png', dataAiHint: 'retro tetris' },
  { id: 'star-hopper', title: 'Star Hopper', description: 'Hop across asteroids to reach the mothership.', image: 'https://placehold.co/300x200.png', dataAiHint: 'retro frogger' },
  { id: 'void-runner', title: 'Void Runner', description: 'Navigate a treacherous void at light speed.', image: 'https://placehold.co/300x200.png', dataAiHint: 'retro runner' },
  { id: 'pixel-serpent', title: 'Pixel Serpent', description: 'Grow your serpent by eating pixel apples.', image: 'https://placehold.co/300x200.png', dataAiHint: 'retro snake' },
  { id: 'galaxy-invaders', title: 'Galaxy Invaders', description: 'Defend the galaxy from waves of invaders.', image: 'https://placehold.co/300x200.png', dataAiHint: 'retro space' },
];

const GameGallery = () => {
  return (
    <section id="games" className="py-16">
      <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Choose Your Challenge</h2>
      <div className="mb-8">
        <AdPlaceholder />
      </div>
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
        
        
        {games.map((game) => (
          <GameModal key={game.id} game={game}>
            <GameCard game={game} />
          </GameModal>
        ))}
      </div>
    </section>
  );
};

export default GameGallery;
