'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Crown, Star } from 'lucide-react';

const TetrisCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-purple-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        {/* Custom pixel art background */}
        <div className="h-56 bg-black border-b-2 border-purple-500 relative overflow-hidden">
          {/* Pixel grid background */}
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

          {/* Animated falling tetris pieces */}
          <div className="absolute top-6 left-1/4 animate-pulse">
            {/* I-piece falling */}
            <div className="flex mb-2">
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
            </div>
          </div>

          {/* T-piece */}
          <div className="absolute top-20 right-1/3 animate-bounce">
            <div className="flex justify-center mb-1">
              <div className="w-5 h-5 bg-purple-400 border border-purple-300"></div>
            </div>
            <div className="flex">
              <div className="w-5 h-5 bg-purple-400 border border-purple-300"></div>
              <div className="w-5 h-5 bg-purple-400 border border-purple-300"></div>
              <div className="w-5 h-5 bg-purple-400 border border-purple-300"></div>
            </div>
          </div>

          {/* S-piece */}
          <div className="absolute top-32 left-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <div className="flex mb-1">
              <div className="w-5 h-5 bg-transparent"></div>
              <div className="w-5 h-5 bg-green-400 border border-green-300"></div>
              <div className="w-5 h-5 bg-green-400 border border-green-300"></div>
            </div>
            <div className="flex">
              <div className="w-5 h-5 bg-green-400 border border-green-300"></div>
              <div className="w-5 h-5 bg-green-400 border border-green-300"></div>
              <div className="w-5 h-5 bg-transparent"></div>
            </div>
          </div>

          {/* L-piece */}
          <div className="absolute top-12 left-2/3 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="flex mb-1">
              <div className="w-5 h-5 bg-transparent"></div>
              <div className="w-5 h-5 bg-transparent"></div>
              <div className="w-5 h-5 bg-orange-400 border border-orange-300"></div>
            </div>
            <div className="flex">
              <div className="w-5 h-5 bg-orange-400 border border-orange-300"></div>
              <div className="w-5 h-5 bg-orange-400 border border-orange-300"></div>
              <div className="w-5 h-5 bg-orange-400 border border-orange-300"></div>
            </div>
          </div>

          {/* Bottom stacked pieces - multiple rows */}
          <div className="absolute bottom-6 left-1/4">
            <div className="flex mb-1">
              <div className="w-5 h-5 bg-yellow-400 border border-yellow-300"></div>
              <div className="w-5 h-5 bg-red-400 border border-red-300"></div>
              <div className="w-5 h-5 bg-blue-400 border border-blue-300"></div>
              <div className="w-5 h-5 bg-orange-400 border border-orange-300"></div>
              <div className="w-5 h-5 bg-green-400 border border-green-300"></div>
              <div className="w-5 h-5 bg-purple-400 border border-purple-300"></div>
            </div>
            <div className="flex">
              <div className="w-5 h-5 bg-cyan-400 border border-cyan-300"></div>
              <div className="w-5 h-5 bg-yellow-400 border border-yellow-300"></div>
              <div className="w-5 h-5 bg-red-400 border border-red-300"></div>
              <div className="w-5 h-5 bg-green-400 border border-green-300"></div>
              <div className="w-5 h-5 bg-blue-400 border border-blue-300"></div>
              <div className="w-5 h-5 bg-orange-400 border border-orange-300"></div>
            </div>
          </div>

          {/* Featured badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-purple-600 text-white">
              <Star className="mr-1 h-3 w-3" />
              FEATURED
            </Badge>
          </div>

          {/* FREE badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white text-black">
              FREE
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle 
              className="text-lg font-bold text-purple-400"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              Tetris
            </CardTitle>
            <Crown className="h-5 w-5 text-yellow-500" />
          </div>
          <CardDescription className="text-gray-300 leading-relaxed">
            Stack falling blocks to create complete lines in this timeless puzzle classic!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pb-6">{/* Game Details */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Difficulty:</span>
              <div className="text-yellow-400 font-bold">Medium</div>
            </div>
            <div>
              <span className="text-gray-400">Type:</span>
              <div className="text-purple-400 font-bold">Puzzle</div>
            </div>
            <div>
              <span className="text-gray-400">Controls:</span>
              <div className="text-blue-400 font-bold">Keyboard</div>
            </div>
          </div>

          {/* Play Button */}
          <Link href="/games/tetris">
            <Button 
              size="lg" 
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              <Play className="mr-2 h-4 w-4" />
              PLAY NOW
            </Button>
          </Link>

          {/* Game Instructions */}
          <p className="text-xs text-gray-400 text-center py-1">
            Rotate blocks • Clear lines • Increase speed
          </p>

          {/* Stats */}
          <div className="flex justify-between items-center text-xs pt-2">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-gray-400">∞</span>
                <div className="text-purple-400">Levels</div>
              </div>
              <div>
                <span className="text-gray-400">7</span>
                <div className="text-purple-400">Pieces</div>
              </div>
              <div>
                <span className="text-gray-400">10</span>
                <div className="text-purple-400">Width</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400">Pro Features Available</div>
              <Badge variant="outline" className="mt-1 bg-orange-600 text-white border-orange-500">
                Upgrade Coming Soon
              </Badge>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default TetrisCard;

