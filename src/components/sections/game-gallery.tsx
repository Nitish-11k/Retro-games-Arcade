import PixelSlitherCard from '@/components/games/pixel-slither-card';
import PixelPaddleCard from '@/components/games/pixel-paddle-card';
import FlappyBirdCard from '@/components/games/flappy-bird-card';
import PixelBoxCard from '@/components/games/pixel-box-card';
import PixManCard from '@/components/games/pix-man-card';
import VoidVanguardCard from '@/components/games/void-vanguard-card';
// import PixelVelocityCard from '@/components/games/pixel-velocity-card';
// import PixelRunnerCard from '@/components/games/pixel-runner-card';

const GameGallery = () => {
  return (
    <section id="games" className="py-16">
      <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Choose Your Challenge</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <PixelSlitherCard />
        <PixelPaddleCard />
        <FlappyBirdCard />
        <PixelBoxCard />
        <PixManCard />
        <VoidVanguardCard />
        {/* <PixelVelocityCard /> */}
        {/* <PixelRunnerCard /> */}
      </div>
    </section>
  );
};

export default GameGallery;
