import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Zap, Car, Target, Users, Trophy, Mountain, Fuel, Settings, Wrench } from 'lucide-react';
import Link from 'next/link';

const PixelVelocityCard = () => {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border-purple-600/50 hover:border-purple-500/70 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:20px_20px]" />
      </div>

      {/* Header */}
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Car className="w-6 h-6 text-purple-300" />
              Pixel-Velocity
            </CardTitle>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                NEW
              </Badge>
              <div className="flex items-center gap-1 text-yellow-400">
                <span className="text-sm font-semibold">4.5</span>
                <span className="text-xs">★</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="relative z-10">
        <p className="text-purple-100/80 mb-4 leading-relaxed">
          Experience the thrill of high-speed racing with realistic physics and AI opponents. 
          Master the art of drifting, upgrade your vehicle, and dominate the leaderboards.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-purple-200/80">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Drift Physics</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-200/80">
            <Target className="w-4 h-4 text-blue-400" />
            <span>AI Racing</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-200/80">
            <Mountain className="w-4 h-4 text-green-400" />
            <span>Dynamic Tracks</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-200/80">
            <Fuel className="w-4 h-4 text-red-400" />
            <span>Car Upgrades</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
            Racing
          </Badge>
          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
            Physics
          </Badge>
          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
            Multiplayer
          </Badge>
          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
            Drifting
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="bg-purple-800/30 rounded-lg p-2">
            <div className="text-lg font-bold text-white">∞</div>
            <div className="text-xs text-purple-300">Endless</div>
          </div>
          <div className="bg-purple-800/30 rounded-lg p-2">
            <div className="text-lg font-bold text-white">10+</div>
            <div className="text-xs text-purple-300">Tracks</div>
          </div>
          <div className="bg-purple-800/30 rounded-lg p-2">
            <div className="text-lg font-bold text-white">4.5★</div>
            <div className="text-xs text-purple-300">Rating</div>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/games/pixel-velocity" className="block">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105">
            <Play className="w-4 h-4 mr-2" />
            Start Racing
          </Button>
        </Link>
      </CardContent>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:via-purple-600/5 group-hover:to-purple-600/10 transition-all duration-300 pointer-events-none" />
    </Card>
  );
};

export default PixelVelocityCard;
