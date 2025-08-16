'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Crown, Star } from 'lucide-react';

const FlappyBirdCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-blue-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        {/* Custom pixel art background */}
        <div className="h-48 bg-black border-b-2 border-blue-500 relative overflow-hidden">
          {/* Pixel grid background */}
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
          
          {/* Retro pixel bird animation */}
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
          <div className="absolute bottom-0 right-8">
            <div className="w-4 h-20 bg-green-600 border border-green-700">
              <div className="w-6 h-3 bg-green-600 border border-green-700 -ml-1 mb-1"></div>
            </div>
          </div>
          <div className="absolute top-0 right-16">
            <div className="w-4 h-16 bg-green-600 border border-green-700">
              <div className="w-6 h-3 bg-green-600 border border-green-700 -ml-1 mt-auto absolute bottom-0"></div>
            </div>
          </div>
          
          {/* Score display like other games */}
          <div className="absolute top-3 left-3 font-mono text-xs text-blue-400">
            SCORE: 0000
          </div>
          
          {/* Featured badge */}
          <Badge className="absolute top-3 right-3 bg-blue-600 text-white border-blue-400">
            FREE
          </Badge>
        </div>
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors font-mono">
                FLAPPY BIRD ⭐⭐⭐⭐☆
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Classic bird with pixel-perfect retro vibes. Flap, survive, and chase the high score!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500">Touch Controls</Badge>
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">Keyboard Support</Badge>
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">High Scores</Badge>
            <Badge className="bg-red-600/20 text-red-400 border-red-500">Achievements</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-blue-400 font-bold">∞</div>
              <div className="text-gray-500 text-xs">Levels</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">3</div>
              <div className="text-gray-500 text-xs">Lives</div>
            </div>
            <div>
              <div className="text-green-400 font-bold">8</div>
              <div className="text-gray-500 text-xs">Badges</div>
            </div>
          </div>
          
          <Link href="/games/flappy-bird" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-mono">
              <Play className="w-5 h-5 mr-2" />
              ▶ Play Now
            </Button>
          </Link>
          
          <div className="text-center">
            <p className="text-xs text-gray-600">Pro Features Available</p>
            <Button variant="outline" size="sm" className="mt-1 text-xs border-blue-500 text-blue-400 hover:bg-blue-500/10">
              Upgrade Coming Soon
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default FlappyBirdCard;