
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';

const PacManCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-yellow-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-black border-b-2 border-yellow-500 relative overflow-hidden flex items-center justify-center">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-black relative transform -rotate-45 rounded-bl-full">
                </div>
            </div>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors font-mono">
            PAC-MAN
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Navigate the maze, eat the pellets, and avoid the ghosts!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">Keyboard Controls</Badge>
            <Badge className="bg-red-600/20 text-red-400 border-red-500">High Scores</Badge>
          </div>
          <Link href="/games/pac-man" className="block">
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-mono">
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
};

export default PacManCard;
