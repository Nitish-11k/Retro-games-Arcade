'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Crown, Star } from 'lucide-react';

const PixelSlitherCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-yellow-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        {/* Custom pixel art background */}
        <div className="h-48 bg-black border-b-2 border-yellow-500 relative overflow-hidden">
          {/* Pixel grid background */}
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

          {/* Snake representation */}
          <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
            <div className="flex items-center">
              {/* Snake head */}
              <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-300 flex items-center justify-center text-xs">
                👁
              </div>
              {/* Snake body */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-6 h-6 bg-yellow-500" />
              ))}
            </div>
          </div>

          {/* Food item */}
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-red-500 border-2 border-red-400 animate-pulse flex items-center justify-center text-xs">
            🍎
          </div>

          {/* Featured badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 text-black font-bold animate-pulse">
              NEW!
            </Badge>
          </div>

          {/* Score display */}
          <div className="absolute bottom-2 left-2 text-green-400 text-xs font-mono">
            SCORE: 1337
          </div>
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-400 text-lg" style={{ fontFamily: '"Press Start 2P", monospace' }}>
              PIXEL SLITHER
            </CardTitle>
            <div className="flex gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <CardDescription className="text-orange-400 text-sm">
            Classic snake with pixel-perfect retro vibes. Grow, survive, and chase the high score!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              Touch Controls
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Keyboard Support
            </Badge>
            <Badge variant="secondary" className="text-xs">
              High Scores
            </Badge>
            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
              Achievements
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-green-400 font-bold">∞</div>
              <div className="text-gray-400">Levels</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold">3</div>
              <div className="text-gray-400">Lives</div>
            </div>
            <div>
              <div className="text-purple-400 font-bold">8</div>
              <div className="text-gray-400">Badges</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/games/pixel-slither" className="flex-1">
              <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 mr-2" />
                Play Now
              </Button>
            </Link>
            <Button variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black" disabled>
              <Crown className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Pro Features Available</div>
            <Badge variant="secondary" className="text-xs opacity-75">
              Upgrade Coming Soon
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PixelSlitherCard;
