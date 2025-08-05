'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

const PixelPaddleCard: React.FC = () => {
  return (
    <Card className="group h-full bg-gradient-to-br from-orange-900 to-red-900 border-2 border-orange-400 hover:border-yellow-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,204,0,0.3)] overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-400">
            <Zap className="w-3 h-3 mr-1" />
            FEATURED
          </Badge>
          <Badge variant="outline" className="text-green-400 border-green-400/50">
            FREE
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors">
          Pixel Paddle
        </CardTitle>
        <p className="text-sm text-orange-200 leading-relaxed">
          Break all the bricks in this retro arcade breakout adventure!
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4 border border-orange-400/30">
          <div className="flex items-center justify-center h-32 text-4xl">
            🧱🏓⚡
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Difficulty:</span>
            <span className="text-orange-300 font-semibold">Medium</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Type:</span>
            <span className="text-orange-300 font-semibold">Arcade</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Controls:</span>
            <span className="text-orange-300 font-semibold">Mouse/Touch</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-orange-400/30">
          <Link href="/games/pixel-paddle">
            <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition-all duration-200 hover:shadow-lg group-hover:animate-pulse">
              <Play className="w-4 h-4 mr-2" />
              PLAY NOW
            </Button>
          </Link>
          <p className="text-xs text-gray-400 text-center mt-2">
            Move paddle • Break bricks • Score points
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PixelPaddleCard;
