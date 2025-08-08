
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Crown, Star } from 'lucide-react';

const PacManCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-yellow-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        {/* Custom pixel art background */}
        <div className="h-48 bg-black border-b-2 border-yellow-500 relative overflow-hidden">
          {/* Pixel grid background */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i}>
                <div 
                  className="absolute border-r border-yellow-400" 
                  style={{ left: i * 25, height: '100%', width: 1 }}
                />
                <div 
                  className="absolute border-b border-yellow-400" 
                  style={{ top: i * 16, width: '100%', height: 1 }}
                />
              </div>
            ))}
          </div>
          
          {/* Pac-Man sprite */}
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <div className="w-12 h-12 bg-yellow-400 rounded-full relative">
              <div className="absolute top-1/2 right-0 w-6 h-6 bg-black transform -translate-y-1/2" 
                   style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}>
              </div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
          
          {/* Ghosts */}
          <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="w-8 h-10 bg-red-500 rounded-t-full relative">
              <div className="absolute bottom-0 w-full h-2 bg-red-500" 
                   style={{ clipPath: 'polygon(0 0, 25% 100%, 50% 0, 75% 100%, 100% 0, 100% 100%, 0 100%)' }}>
              </div>
              <div className="absolute top-2 left-1 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-2 right-1 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-2 left-1.5 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute top-2 right-1.5 w-1 h-1 bg-black rounded-full"></div>
            </div>
          </div>
          
          {/* Pellets */}
          <div className="absolute bottom-6 left-8">
            <div className="flex gap-2">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Score display */}
          <div className="absolute top-3 left-3 font-mono text-xs text-yellow-400">
            SCORE: 2340
          </div>
          
          {/* Featured badge */}
          <Badge className="absolute top-3 right-3 bg-yellow-600 text-black border-yellow-400">
            <Star className="mr-1 h-3 w-3" />
            CLASSIC
          </Badge>
        </div>
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors font-mono">
                PAC-MAN ⭐⭐⭐⭐⭐
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Navigate the maze, eat the pellets, and avoid the ghosts in this arcade classic!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">Keyboard Controls</Badge>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500">WASD Support</Badge>
            <Badge className="bg-red-600/20 text-red-400 border-red-500">High Scores</Badge>
            <Badge className="bg-green-600/20 text-green-400 border-green-500">AI Ghosts</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-yellow-400 font-bold">1</div>
              <div className="text-gray-500 text-xs">Maze</div>
            </div>
            <div>
              <div className="text-red-400 font-bold">4</div>
              <div className="text-gray-500 text-xs">Ghosts</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold">3</div>
              <div className="text-gray-500 text-xs">Lives</div>
            </div>
          </div>
          
          <Link href="/games/pac-man" className="block">
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-mono">
              <Play className="w-5 h-5 mr-2" />
              ▶ Play Now
            </Button>
          </Link>
          
          <div className="text-center">
            <p className="text-xs text-gray-600">Classic Arcade Experience</p>
            <Button variant="outline" size="sm" className="mt-1 text-xs border-yellow-500 text-yellow-400 hover:bg-yellow-500/10">
              Retro Gaming at its Best
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PacManCard;
