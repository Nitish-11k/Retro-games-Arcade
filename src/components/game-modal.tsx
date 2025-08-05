
'use client';

import React from 'react';
import type { Game, Score } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';


interface GameModalProps {
  game: Game;
  children: React.ReactNode;
}

// Mock data for per-game leaderboard
const mockScores: Score[] = [
  { id: '1', gameId: 'block-stacker', gameTitle: 'Block Stacker', player: 'PXL', points: 99990, rank: 1 },
  { id: '2', gameId: 'block-stacker', gameTitle: 'Block Stacker', player: 'ARC', points: 85000, rank: 2 },
  { id: '3', gameId: 'block-stacker', gameTitle: 'Block Stacker', player: 'ADE', points: 72450, rank: 3 },
];

export function GameModal({ game, children }: GameModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [scoreToSubmit, setScoreToSubmit] = React.useState<number | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const score = formData.get('score');
    const player = user?.displayName || formData.get('player');
    
    toast({
      title: "Score Submitted!",
      description: `Player ${player} submitted a score of ${score} for ${game.title}.`,
    });
    setScoreToSubmit(null);
    (event.target as HTMLFormElement).reset();
  };

  const handleScoreFromGame = (score: number) => {
    setScoreToSubmit(score);
  }

  const renderGame = () => {
    switch (game.id) {
      case 'flappy-pixel':
        return (
          <div className="aspect-video bg-black border-4 border-border flex items-center justify-center">
            <p className="text-primary animate-pulse text-lg">-- FLAPPY PIXEL COMING SOON --</p>
          </div>
        );
      default:
        return (
          <div className="aspect-video bg-black border-4 border-border flex items-center justify-center">
            <p className="text-primary animate-pulse text-lg">-- GAME AREA --</p>
          </div>
        );
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] grid grid-rows-[auto_1fr] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-headline">{game.title}</DialogTitle>
          <DialogDescription>{game.description}</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 overflow-y-auto p-6">
          <div className="flex flex-col space-y-4">
            {renderGame()}
            <div>
              <h3 className="text-xl font-headline mb-2">Instructions</h3>
              <p className="text-sm text-muted-foreground">
                {game.instructions || "This is where the game instructions would go. For now, just imagine the most awesome retro game you can. Use your keyboard to play. Good luck, gamer!"}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="text-xl font-headline mb-2">Submit Your High Score</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="player">Player (3 Chars)</Label>
                  <Input type="text" id="player" name="player" maxLength={3} placeholder="AAA" required className="uppercase" defaultValue={user?.displayName || ''} disabled={!!user} />
                </div>
                 <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="score">Score</Label>
                  <Input type="number" id="score" name="score" placeholder="000000" required defaultValue={scoreToSubmit ?? ''} />
                </div>
                <Button type="submit" variant="secondary">Submit Score</Button>
              </form>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-headline mb-2">Leaderboard</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockScores.map((score) => (
                    <TableRow key={score.id}>
                      <TableCell className="font-medium">{score.rank}</TableCell>
                      <TableCell>{score.player}</TableCell>
                      <TableCell className="text-right">{score.points.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
