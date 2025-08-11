'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, Zap } from 'lucide-react';

const VoidVanguardCard = () => {
  return (
    <Card className="group flex flex-col h-full hover:scale-105 transition-all duration-300 border-indigo-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-black border-b-2 border-indigo-500 relative overflow-hidden flex items-center justify-center p-4">
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
          
          <div className="w-8 h-12 bg-purple-400 relative animate-pulse" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

          <Badge className="absolute top-3 left-3 bg-indigo-600/20 text-indigo-300 border-indigo-400">
            <Zap className="mr-1 h-3 w-3" />
            SCI-FI
          </Badge>
          <Badge className="absolute top-3 right-3 bg-green-600 text-white border-green-400">
            FREE
          </Badge>
        </div>
        
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors font-headline">
            Void Vanguard
          </CardTitle>
          <div className="flex items-center mt-1">
            {[...Array(4)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
            <Star className="w-5 h-5 text-gray-600 fill-current" />
          </div>
          <CardDescription className="text-gray-400 text-sm h-10 mt-2">
            A classic top-down space shooter. Blast through waves of alien ships and defend the galaxy.
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-500">Shooter</Badge>
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">Keyboard</Badge>
            <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500">Space Combat</Badge>
            <Badge className="bg-red-600/20 text-red-400 border-red-500">High Scores</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-indigo-400 font-bold">∞</div>
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
        </div>
        
        <div className="mt-auto">
          <Link href="/games/void-vanguard" className="block mt-4">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-headline">
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
          </Link>
          
          <div className="text-center mt-2">
            <Button variant="outline" size="sm" disabled className="mt-1 text-xs border-indigo-500 text-indigo-400 hover:bg-indigo-500/10">
              Defend the Galaxy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoidVanguardCard;
