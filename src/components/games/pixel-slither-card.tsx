'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';

const PixelSlitherCard = () => {
  return (
    <Card className="group flex flex-col h-full hover:scale-105 transition-all duration-300 border-green-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-black border-b-2 border-green-500 relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div
                  className="absolute border-r border-green-400"
                  style={{ left: i * 25, height: '100%', width: 1 }}
                />
                <div
                  className="absolute border-b border-green-400"
                  style={{ top: i * 16, width: '100%', height: 1 }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-300 flex items-center justify-center text-xs animate-pulse">
              👁
            </div>
            <div className="w-6 h-6 bg-yellow-500" />
            <div className="w-6 h-6 bg-yellow-500" />
            <div className="w-6 h-6 bg-yellow-500" />
            <div className="w-6 h-6 bg-yellow-500" />
          </div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-red-500 border-2 border-red-400 animate-pulse flex items-center justify-center text-xs">
            🍎
          </div>

          <Badge className="absolute top-3 right-3 bg-green-600 text-white border-green-400">
            NEW!
          </Badge>
        </div>
        
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors font-headline">
            Pixel Slither
          </CardTitle>
          <div className="flex items-center mt-1">
            {[...Array(4)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
            <Star className="w-5 h-5 text-gray-600 fill-current" />
          </div>
          <CardDescription className="text-gray-400 text-sm h-10 mt-2">
            The classic snake game, reimagined. Grow your snake by eating apples, but don't hit the walls or yourself!
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-green-600/20 text-green-400 border-green-500">Snake</Badge>
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">Keyboard</Badge>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500">Touch</Badge>
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">High Scores</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-green-400 font-bold">∞</div>
              <div className="text-gray-500 text-xs">Speed Levels</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">1</div>
              <div className="text-gray-500 text-xs">Life</div>
            </div>
            <div>
              <div className="text-green-400 font-bold">Top 10</div>
              <div className="text-gray-500 text-xs">Leaderboard</div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link href="/games/pixel-slither" className="block mt-4">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-headline">
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
          </Link>
          
          <div className="text-center mt-2">
            <Button variant="outline" size="sm" disabled className="mt-1 text-xs border-green-500 text-green-400 hover:bg-green-500/10">
              Eat and Grow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PixelSlitherCard;
