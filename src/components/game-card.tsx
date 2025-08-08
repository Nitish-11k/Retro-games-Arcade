import Image from 'next/image';
import type { Game } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <Card className="overflow-hidden h-full cursor-pointer hover:border-primary transition-all hover:scale-105 duration-300 ease-in-out">
      <CardHeader className="p-0">
        <Image
          src={game.image}
          alt={`Cover art for ${game.title}`}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          data-ai-hint={game.dataAiHint}
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-headline tracking-tight">{game.title}</CardTitle>
      </CardContent>
    </Card>
  );
};

export default GameCard;
