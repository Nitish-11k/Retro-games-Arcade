
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';

const BounceBallCard = () => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 border-cyan-500 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden h-full">
      <div className="relative">
        <div className="h-48 bg-black border-b-2 border-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>
                  <div 
                    className="absolute border-r border-cyan-400" 
                    style={{ left: i * 25, height: '100%', width: 1 }}
                  />
                  <div 
                    className="absolute border-b border-cyan-400" 
                    style={{ top: i * 16, width: '100%', height: 1 }}
                  />
                </div>
              ))
            }
          </div>
          
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="w-8 h-8 bg-cyan-400 rounded-full border-2 border-cyan-200"></div>
          </div>
          
          <div className="absolute bottom-0 right-8">
            <div className="w-16 h-4 bg-gray-700 border border-gray-600"></div>
          </div>
          <div className="absolute top-16 right-16">
            <div className="w-16 h-4 bg-gray-700 border border-gray-600"></div>
          </div>
          
          <div className="absolute top-3 left-3 font-mono text-xs text-cyan-400">
            SCORE: 0000
          </div>
          
          <Badge className="absolute top-3 right-3 bg-cyan-600 text-white border-cyan-400">
            NEW
          </Badge>
        </div>
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors font-mono">
                BOUNCE BALL
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Control a bouncing ball through challenging platform levels.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500">Physics-Based</Badge>
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500">Platformer</Badge>
            <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500">High Scores</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-cyan-400 font-bold">2</div>
              <div className="text-gray-500 text-xs">Levels</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">3</div>
              <div className="text-gray-500 text-xs">Lives</div>
            </div>
            <div>
              <div className="text-green-400 font-bold">⭐</div>
              <div className="text-gray-500 text-xs">Collectibles</div>
            </div>
          </div>
          
          <Link href="/games/bounce-ball" className="block">
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 group-hover:shadow-lg transition-all font-mono">
              <Play className="w-5 h-5 mr-2" />
              ▶ Play Now
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
};

export default BounceBallCard;
