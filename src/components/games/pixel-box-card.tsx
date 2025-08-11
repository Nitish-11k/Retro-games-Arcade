'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';

const PixelBoxCard = () => {
  return (
    <Card className="group flex flex-col h-full hover:scale-105 transition-all duration-300 border-purple-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-black border-b-2 border-purple-500 relative overflow-hidden p-4">
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i}>
                <div
                  className="absolute border-r border-purple-400"
                  style={{ left: i * 25, height: '100%', width: 1 }}
                />
                <div
                  className="absolute border-b border-purple-400"
                  style={{ top: i * 16, width: '100%', height: 1 }}
                />
              </div>
            ))}
          </div>

          <div className="absolute top-6 left-1/4 animate-pulse">
            <div className="flex">
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
            </div>
          </div>
          <div className="absolute top-12 right-1/4 animate-bounce">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-yellow-300" />
          </div>
          <div className="absolute bottom-4 left-1/2 w-20 h-5 bg-red-500 border border-red-400" />

          <Badge className="absolute top-3 left-3 bg-purple-600/20 text-purple-300 border-purple-400">
            <Star className="mr-1 h-3 w-3" />
            CLASSIC
          </Badge>
          <Badge className="absolute top-3 right-3 bg-green-600 text-white border-green-400">
            FREE
          </Badge>
        </div>

        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors font-headline">
            Pixel Box
          </CardTitle>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
          </div>
          <CardDescription className="text-gray-400 text-sm h-10 mt-2">
            The timeless puzzle game. Stack falling blocks, clear lines, and chase the ultimate high score.
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">Puzzle</Badge>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500">Keyboard</Badge>
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">Endless Mode</Badge>
            <Badge className="bg-green-600/20 text-green-400 border-green-500">High Scores</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-purple-400 font-bold">∞</div>
              <div className="text-gray-500 text-xs">Levels</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">7</div>
              <div className="text-gray-500 text-xs">Pieces</div>
            </div>
            <div>
              <div className="text-green-400 font-bold">60</div>
              <div className="text-gray-500 text-xs">FPS</div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link href="/games/pixel-box" className="block mt-4">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-headline">
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
          </Link>
          
          <div className="text-center mt-2">
            <Button variant="outline" size="sm" disabled className="mt-1 text-xs border-purple-500 text-purple-400 hover:bg-purple-500/10">
              Stack the Blocks
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PixelBoxCard;

