'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Shield, Zap } from 'lucide-react';

const VoidVanguardCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-green-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-black border-b-2 border-green-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {/* Background grid */}
          </div>
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
            {/* Player ship sprite */}
            <div className="w-8 h-4 bg-cyan-400" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
          <Badge className="absolute top-3 right-3 bg-green-600 text-white border-green-400">
            NEW
          </Badge>
        </div>
        
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors font-mono">
            Void Vanguard
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            A fast-paced retro space shooter.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-600/20 text-green-400 border-green-500">Space Shooter</Badge>
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">High Scores</Badge>
          </div>
          
          <Link href="/games/void-vanguard" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-mono">
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
};

export default VoidVanguardCard;
