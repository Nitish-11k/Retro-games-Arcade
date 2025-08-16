'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Target } from 'lucide-react';

const BubbleShooterCard = () => {
  return (
    <Card className="group flex flex-col h-full hover:scale-105 transition-all duration-300 border-purple-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-black border-b-2 border-purple-500 relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div
                  className="absolute border-r border-purple-400"
                  style={{ left: i * 30, height: '100%', width: 1 }}
                />
                <div
                  className="absolute border-b border-purple-400"
                  style={{ top: i * 20, width: '100%', height: 1 }}
                />
              </div>
            ))}
          </div>
          
          {/* Bubble grid representation */}
          <div className="grid grid-cols-5 gap-1 opacity-80">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'][i % 5]
                }`}
              />
            ))}
          </div>
          
          {/* Launcher representation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white shadow-lg">
              <div className="w-4 h-4 bg-white rounded-full m-auto mt-1"></div>
            </div>
          </div>
          
          <Badge className="absolute top-3 left-3 bg-purple-600/20 text-purple-300 border-purple-400">
            <Target className="mr-1 h-3 w-3" />
            PUZZLE
          </Badge>
          <Badge className="absolute top-3 right-3 bg-green-600 text-white border-green-400">
            FREE
          </Badge>
        </div>
        
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors font-headline">
            Bubble Shooter
          </CardTitle>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-purple-400 fill-current" />)}
          </div>
          <CardDescription className="text-gray-400 text-sm h-10 mt-2">
            Match and pop colorful bubbles in this addictive puzzle game. Aim carefully and create chain reactions!
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">Puzzle</Badge>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500">Mouse</Badge>
            <Badge className="bg-pink-600/20 text-pink-400 border-pink-500">Strategy</Badge>
            <Badge className="bg-green-600/20 text-green-400 border-green-500">High Scores</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-purple-400 font-bold">5</div>
              <div className="text-gray-500 text-xs">Colors</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold">13</div>
              <div className="text-gray-500 text-xs">Columns</div>
            </div>
            <div>
              <div className="text-green-400 font-bold">∞</div>
              <div className="text-gray-500 text-xs">Levels</div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link href="/games/bubble-shooter" className="block mt-4">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-headline">
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
          </Link>
          
          <div className="text-center mt-2">
            <Button variant="outline" size="sm" disabled className="mt-1 text-xs border-purple-500 text-purple-400 hover:bg-purple-500/10">
              Match & Pop Bubbles
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BubbleShooterCard;


