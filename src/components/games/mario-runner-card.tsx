'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Crown, Star } from 'lucide-react';

const MarioRunnerCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-red-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        {/* Custom pixel art background */}
        <div className="h-48 bg-black border-b-2 border-red-500 relative overflow-hidden">
          {/* Pixel grid background */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div 
                  className="absolute border-r border-red-400" 
                  style={{ left: i * 25, height: '100%', width: 1 }}
                />
                <div 
                  className="absolute border-b border-red-400" 
                  style={{ top: i * 16, width: '100%', height: 1 }}
                />
              </div>
            ))}
          </div>
          
          {/* Animated Mario sprite */}
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="grid grid-cols-8 gap-1">
              {/* Mario pixel sprite */}
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-yellow-600"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              
              <div className="w-2 h-2 bg-yellow-600"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              
              <div className="w-2 h-2 bg-yellow-600"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-yellow-400"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              <div className="w-2 h-2 bg-blue-600"></div>
              <div className="w-2 h-2 bg-transparent"></div>
              <div className="w-2 h-2 bg-transparent"></div>
            </div>
          </div>
          
          {/* Scrolling platform elements */}
          <div className="absolute bottom-0 right-8">
            <div className="w-16 h-8 bg-yellow-600 border border-yellow-700">
              <div className="w-4 h-4 bg-yellow-500 border border-yellow-700 m-1"></div>
            </div>
          </div>
          <div className="absolute bottom-0 right-32">
            <div className="w-12 h-6 bg-green-600 border border-green-700"></div>
          </div>
          
          {/* Coins animation */}
          <div className="absolute top-16 right-16 animate-spin">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded-full"></div>
          </div>
          <div className="absolute top-32 right-24 animate-spin" style={{ animationDelay: '0.5s' }}>
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded-full"></div>
          </div>
          
          {/* Score display */}
          <div className="absolute top-3 left-3 font-mono text-xs text-red-400">
            SCORE: 0000
          </div>
          
          {/* Featured badge */}
          <Badge className="absolute top-3 right-3 bg-red-600 text-white border-red-400">
            NEW
          </Badge>
        </div>
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-red-400 group-hover:text-red-300 transition-colors font-mono">
                MARIO RUNNER ⭐⭐⭐⭐⭐
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Classic auto-runner with pixel-perfect Mario! Jump, collect coins, and avoid enemies in this endless adventure!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-red-600/20 text-red-400 border-red-500">Auto-Runner</Badge>
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">Keyboard Support</Badge>
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">High Scores</Badge>
            <Badge className="bg-green-600/20 text-green-400 border-green-500">Efficient DSA</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-red-400 font-bold">∞</div>
              <div className="text-gray-500 text-xs">Levels</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">3</div>
              <div className="text-gray-500 text-xs">Lives</div>
            </div>
            <div>
              <div className="text-green-400 font-bold">60</div>
              <div className="text-gray-500 text-xs">FPS</div>
            </div>
          </div>
          
          <Link href="/games/mario-runner" className="block">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-mono">
              <Play className="w-5 h-5 mr-2" />
              ▶ Play Now
            </Button>
          </Link>
          
          <div className="text-center">
            <p className="text-xs text-gray-600">Optimized Game Engine</p>
            <Button variant="outline" size="sm" className="mt-1 text-xs border-red-500 text-red-400 hover:bg-red-500/10">
              Advanced Physics & DSA
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MarioRunnerCard;
