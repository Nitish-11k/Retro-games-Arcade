'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Heart } from 'lucide-react';

const RedBallCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-red-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-black border-b-2 border-red-500 relative overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i}>
                <div className="absolute border-r border-red-400" style={{ left: i * 25, height: '100%', width: 1 }} />
                <div className="absolute border-b border-red-400" style={{ top: i * 16, width: '100%', height: 1 }} />
              </div>
            ))}
          </div>
          {/* Red ball */}
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="w-12 h-12 bg-red-500 rounded-full shadow-[0_0_20px_rgba(255,0,0,0.5)]" />
          </div>
          {/* Spikes */}
          <div className="absolute bottom-6 left-10 flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-red-400" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            ))}
          </div>
          {/* Featured badges */}
          <Badge className="absolute top-3 right-3 bg-red-600 text-white border-red-400">
            <Star className="mr-1 h-3 w-3" />
            NEW
          </Badge>
        </div>

        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-red-400 group-hover:text-red-300 transition-colors font-mono">RED BALL QUEST</CardTitle>
              <CardDescription className="text-gray-400 text-sm">Bounce, roll, and jump through hazards. Collect all stars!</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-red-600/20 text-red-400 border-red-500">Physics</Badge>
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">Stars</Badge>
            <Badge className="bg-green-600/20 text-green-400 border-green-500">Enemies</Badge>
          </div>

          <Link href="/games/red-ball" className="block">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-mono">
              <Play className="w-5 h-5 mr-2" />
              ▶ Play Now
            </Button>
          </Link>

          <div className="text-center">
            <p className="text-xs text-gray-600">Classic 2D Platformer Feel</p>
            <Button variant="outline" size="sm" className="mt-1 text-xs border-red-500 text-red-400 hover:bg-red-500/10">
              <Heart className="w-3 h-3 mr-1" /> Retro Challenge
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RedBallCard;


