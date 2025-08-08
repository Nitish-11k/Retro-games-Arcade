'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Shield, Zap, Star } from 'lucide-react';

const VoidVanguardCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-purple-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        {/* Space battle background */}
        <div className="h-48 bg-black border-b-2 border-purple-500 relative overflow-hidden">
          {/* Stars background */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: Math.random() * 0.8 + 0.2
                }}
              />
            ))}
          </div>
          
          {/* Player ship */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse">
            <div className="w-8 h-12 bg-purple-400 relative" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-cyan-400 animate-pulse"></div>
            </div>
          </div>
          
          {/* Enemy ships */}
          <div className="absolute top-6 right-8 animate-bounce" style={{ animationDelay: '0.3s' }}>
            <div className="w-6 h-8 bg-red-500 relative" style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}></div>
          </div>
          
          <div className="absolute top-12 left-12 animate-bounce" style={{ animationDelay: '0.7s' }}>
            <div className="w-6 h-8 bg-red-500 relative" style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}></div>
          </div>
          
          {/* Projectiles */}
          <div className="absolute top-1/3 left-1/3">
            <div className="w-1 h-4 bg-cyan-400 animate-pulse"></div>
          </div>
          
          <div className="absolute top-2/3 right-1/4">
            <div className="w-1 h-4 bg-red-400 animate-pulse"></div>
          </div>
          
          {/* Score display */}
          <div className="absolute top-3 left-3 font-mono text-xs text-purple-400">
            SCORE: 15,680
          </div>
          
          {/* Featured badge */}
          <Badge className="absolute top-3 right-3 bg-purple-600 text-white border-purple-400">
            <Zap className="mr-1 h-3 w-3" />
            SCI-FI
          </Badge>
        </div>
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors font-mono">
                VOID VANGUARD ⭐⭐⭐⭐⭐
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Navigate through space, dodge enemies, and survive the cosmic battlefield!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">Keyboard Controls</Badge>
            <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500">Space Combat</Badge>
            <Badge className="bg-red-600/20 text-red-400 border-red-500">High Scores</Badge>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500">Survival Mode</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-purple-400 font-bold">∞</div>
              <div className="text-gray-500 text-xs">Waves</div>
            </div>
            <div>
              <div className="text-red-400 font-bold">⚡</div>
              <div className="text-gray-500 text-xs">Power</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold">3</div>
              <div className="text-gray-500 text-xs">Lives</div>
            </div>
          </div>
          
          <Link href="/games/void-vanguard" className="block">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-mono">
              <Play className="w-5 h-5 mr-2" />
              ▶ Play Now
            </Button>
          </Link>
          
          <div className="text-center">
            <p className="text-xs text-gray-600">Epic Space Adventure</p>
            <Button variant="outline" size="sm" className="mt-1 text-xs border-purple-500 text-purple-400 hover:bg-purple-500/10">
              Defend the Galaxy
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default VoidVanguardCard;
