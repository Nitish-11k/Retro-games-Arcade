import type { Score } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const allScores: Score[] = [
  { id: '1', gameId: 'block-stacker', gameTitle: 'Block Stacker', player: 'PXL', points: 99990, rank: 1 },
  { id: '4', gameId: 'galaxy-invaders', gameTitle: 'Galaxy Invaders', player: 'ZAP', points: 98500, rank: 2 },
  { id: '2', gameId: 'block-stacker', gameTitle: 'Block Stacker', player: 'ARC', points: 85000, rank: 3 },
  { id: '5', gameId: 'pixel-serpent', gameTitle: 'Pixel Serpent', player: 'SSS', points: 75200, rank: 4 },
  { id: '3', gameId: 'block-stacker', gameTitle: 'Block Stacker', player: 'ADE', points: 72450, rank: 5 },
];

const Leaderboards = () => {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">High Scores</h2>
      <Tabs defaultValue="overall" className="w-full font-headline">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto font-headline">
          <TabsTrigger value="overall" className="font-headline">Overall</TabsTrigger>
          <TabsTrigger value="games" disabled className="font-headline">By Game (Soon!)</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
            <div className="border rounded-lg mt-4 font-headline">
              <Table>
                <TableHeader>
                  <TableRow className="font-headline">
                    <TableHead className="w-[50px] font-headline">Rank</TableHead>
                    <TableHead className="font-headline">Player</TableHead>
                    <TableHead className="font-headline">Game</TableHead>
                    <TableHead className="text-right font-headline">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allScores.map((score) => (
                    <TableRow key={score.id} className="font-headline">
                      <TableCell className="font-medium font-headline">{score.rank}</TableCell>
                      <TableCell className="font-headline">{score.player}</TableCell>
                      <TableCell className="font-headline">{score.gameTitle}</TableCell>
                      <TableCell className="text-right font-headline">{score.points.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboards;
