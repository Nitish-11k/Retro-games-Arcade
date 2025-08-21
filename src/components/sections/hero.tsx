'use client';

import { Button } from '@/components/ui/button';

const Hero = () => {
  const handleEnterArcade = () => {
    const gamesSection = document.getElementById('games');
    if (gamesSection) {
      gamesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section id="home" className="text-center py-20 md:py-32">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline tracking-tighter leading-tight">
        Pixel Power
        <br />
        Meets Endless Play
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base">
        Your portal to custom-coded, retro-inspired arcade classics.
      </p>
      <div className="mt-8">
        <Button 
          size="lg" 
          variant="secondary" 
          className="text-lg px-8 py-6"
          onClick={handleEnterArcade}
        >
          Enter The Arcade
        </Button>
      </div>
    </section>
  );
};

export default Hero;
