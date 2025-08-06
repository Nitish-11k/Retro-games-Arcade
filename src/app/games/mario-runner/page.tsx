'use client';

import { Suspense } from 'react';
import MarioRunner from '@/components/games/mario-runner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Settings } from 'lucide-react';
import Link from 'next/link';

export default function MarioRunnerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Arcade
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-red-400 font-mono">
              MARIO RUNNER
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 text-gray-400 hover:bg-gray-700"
            >
              <Info className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 text-gray-400 hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Game Container */}
        <div className="flex justify-center">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center w-full max-w-4xl h-96 bg-black rounded-lg border-2 border-red-500">
              <div className="text-red-400 font-mono text-xl mb-4">Loading Mario Runner...</div>
              <div className="w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <MarioRunner />
          </Suspense>
        </div>

        {/* Game Information */}
        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-red-500/30">
            <h3 className="text-xl font-bold text-red-400 mb-4 font-mono">ABOUT THE ENGINE</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Efficient Spatial Partitioning using Queue DSA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Fixed Timestep Physics at 60 FPS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Finite State Machine for Player Control</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>AABB Collision Detection System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Procedural Level Generation</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-red-500/30">
            <h3 className="text-xl font-bold text-red-400 mb-4 font-mono">GAME FEATURES</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Classic Mario-style Auto-Runner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Coin Collection & Scoring System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Enemy Stomping Mechanics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Invulnerability & Health System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Responsive Touch & Keyboard Controls</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="max-w-4xl mx-auto mt-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-red-500/30">
            <h3 className="text-xl font-bold text-red-400 mb-4 font-mono">TECHNICAL IMPLEMENTATION</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Data Structures</h4>
                <ul className="space-y-1">
                  <li>• Sorted Array (Level Objects)</li>
                  <li>• Dynamic Queue (Active Objects)</li>
                  <li>• Vector2 Math System</li>
                  <li>• AABB Bounding Boxes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Algorithms</h4>
                <ul className="space-y-1">
                  <li>• Spatial Partitioning</li>
                  <li>• Fixed Timestep Integration</li>
                  <li>• Collision Detection/Response</li>
                  <li>• State Machine Logic</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Performance</h4>
                <ul className="space-y-1">
                  <li>• O(n) Active Objects Only</li>
                  <li>• 60 FPS Consistent Physics</li>
                  <li>• Memory Efficient Cleanup</li>
                  <li>• Optimized Canvas Rendering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
