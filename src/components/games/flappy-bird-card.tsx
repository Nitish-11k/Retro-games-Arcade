'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';

const FlappyBirdCard = () => {
  return (
    <Card className="group flex flex-col h-full hover:scale-105 transition-all duration-300 border-blue-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        <div className="h-32 sm:h-40 lg:h-48 bg-black border-b-2 border-blue-500 relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div
                  className="absolute border-r border-blue-400"
                  style={{ left: i * 25, height: '100%', width: 1 }}
                />
                <div
                  className="absolute border-b border-blue-400"
                  style={{ top: i * 16, width: '100%', height: 1 }}
                />
              </div>
            ))}
          </div>
          
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="grid grid-cols-4 gap-1">
              {/* Pixel bird sprite */}
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-white"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-orange-500"></div>
              
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-orange-600"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-transparent"></div>
            </div>
          </div>
          
          {/* Retro pixel pipes */}
          <div className="absolute bottom-0 right-4 sm:right-8">
            <div className="w-3 sm:w-4 h-16 sm:h-20 bg-green-600 border border-green-700">
              <div className="w-4 sm:w-6 h-2 sm:h-3 bg-green-600 border border-green-700 -ml-1 mb-1"></div>
            </div>
          </div>
          <div className="absolute top-0 right-8 sm:right-16">
            <div className="w-3 sm:w-4 h-12 sm:h-16 bg-green-600 border border-green-700">
              <div className="w-4 sm:w-6 h-2 sm:h-3 bg-green-600 border border-green-700 -ml-1 mt-auto absolute bottom-0"></div>
            </div>
          </div>
          
          {/* Score display like other games */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 font-mono text-xs text-blue-400">
            SCORE: 0000
          </div>
          
          <Badge className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-600 text-white border-green-400 text-xs">
            FREE
          </Badge>
        </div>
        
        <CardHeader className="relative p-3 sm:p-4">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors font-headline">
            Flappy Bird
          </CardTitle>
          <div className="flex items-center mt-1">
            {[...Array(3)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />)}
            {[...Array(2)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 fill-current" />)}
          </div>
          <CardDescription className="text-gray-400 text-xs sm:text-sm h-8 sm:h-10 mt-2">
            The infamous classic is back. Tap to flap, navigate through the pipes, and see how far you can get.
          </CardDescription>
        </CardHeader>
      </div>
      
      <CardContent className="space-y-3 sm:space-y-4 flex-grow flex flex-col justify-between p-3 sm:p-4">
        <div>
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500 text-xs">Endless</Badge>
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500 text-xs">Keyboard</Badge>
            <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500 text-xs">Touch</Badge>
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500 text-xs">High Scores</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
            <div>
              <div className="text-blue-400 font-bold">∞</div>
              <div className="text-gray-500 text-xs">Pipes</div>
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
          <Link href="/games/flappy-bird" className="block mt-3 sm:mt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 group-hover:shadow-lg transition-all font-headline text-sm sm:text-base">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Play Now
            </Button>
          </Link>
          
          <div className="text-center mt-2">
            <Button variant="outline" size="sm" disabled className="mt-1 text-xs border-blue-500 text-blue-400 hover:bg-blue-500/10">
              Flap the Bird
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlappyBirdCard;