"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Zap, Car, Target, Users, Trophy, Mountain, Fuel, Settings, Wrench } from 'lucide-react';

interface CarPhysics {
  // Position and orientation
  x: number;
  y: number;
  z: number;
  rotation: number;
  pitch: number;
  roll: number;
  
  // Velocity and acceleration
  velocity: number;
  velocityX: number;
  velocityZ: number;
  acceleration: number;
  
  // Drift state
  isDrifting: boolean;
  driftAngle: number;
  driftStartTime: number;
  driftPoints: number;
  comboMultiplier: number;
  
  // Car properties
  enginePower: number;
  torque: number;
  weight: number;
  tireGrip: number;
  suspension: number;
  
  // Transmission
  gear: number;
  rpm: number;
  maxRpm: number;
  
  // Input state
  throttle: number;
  brake: number;
  steering: number;
  handbrake: boolean;
}

interface GameState {
  car: CarPhysics;
  track: {
    width: number;
    length: number;
    checkpoints: Array<{ x: number; z: number; radius: number }>;
  };
  session: {
    totalScore: number;
    bestDrift: number;
    totalDrifts: number;
    sessionTime: number;
  };
  ui: {
    showGarage: boolean;
    showTuning: boolean;
    showTrackSelect: boolean;
  };
}

const PixelVelocityPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'garage' | 'tuning' | 'trackSelect' | 'playing'>('menu');
  const [currentScore, setCurrentScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [driftAngle, setDriftAngle] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(2000);
  const [gear, setGear] = useState(1);
  const [cash, setCash] = useState(10000);

  // Car physics constants
  const PHYSICS = {
    GRAVITY: 9.81,
    AIR_RESISTANCE: 0.02,
    ROLLING_RESISTANCE: 0.015,
    TIRE_GRIP_FRONT: 0.8,
    TIRE_GRIP_REAR: 0.6,
    WEIGHT_TRANSFER: 0.3,
    DRIFT_ANGLE_THRESHOLD: 15, // degrees
    DRIFT_SPEED_THRESHOLD: 5, // m/s
    MAX_DRIFT_ANGLE: 90, // degrees
  };

  // Initialize car with realistic physics
  const initializeCar = useCallback((): CarPhysics => ({
    x: 0,
    y: 0,
    z: 0,
    rotation: 0,
    pitch: 0,
    roll: 0,
    velocity: 0,
    velocityX: 0,
    velocityZ: 0,
    acceleration: 0,
    isDrifting: false,
    driftAngle: 0,
    driftStartTime: 0,
    driftPoints: 0,
    comboMultiplier: 1,
    enginePower: 300, // horsepower
    torque: 400, // lb-ft
    weight: 1500, // kg
    tireGrip: 0.8,
    suspension: 0.7,
    gear: 1,
    rpm: 2000,
    maxRpm: 8000,
    throttle: 0,
    brake: 0,
    steering: 0,
    handbrake: false,
  }), []);

  // Calculate drift angle between car direction and velocity
  const calculateDriftAngle = useCallback((car: CarPhysics): number => {
    if (Math.abs(car.velocity) < 0.1) return 0;
    
    const velocityAngle = Math.atan2(car.velocityZ, car.velocityX);
    const carAngle = car.rotation;
    let angleDiff = Math.abs(velocityAngle - carAngle);
    
    // Normalize angle to 0-180 degrees
    if (angleDiff > Math.PI) {
      angleDiff = 2 * Math.PI - angleDiff;
    }
    
    return (angleDiff * 180) / Math.PI;
  }, []);

  // Update car physics
  const updateCarPhysics = useCallback((car: CarPhysics, deltaTime: number) => {
    const dt = deltaTime / 1000; // Convert to seconds
    
    // Handle input
    if (car.throttle > 0) {
      car.acceleration = (car.enginePower * car.throttle) / car.weight;
      car.rpm = Math.min(car.rpm + 500 * dt, car.maxRpm);
    } else {
      car.acceleration = 0;
      car.rpm = Math.max(car.rpm - 200 * dt, 1000);
    }
    
    if (car.brake > 0) {
      car.acceleration -= (car.brake * 15) / car.weight;
    }
    
    // Update velocity
    car.velocity += car.acceleration * dt;
    car.velocity = Math.max(0, car.velocity - (car.velocity * PHYSICS.AIR_RESISTANCE + PHYSICS.ROLLING_RESISTANCE) * dt);
    
    // Calculate velocity components
    car.velocityX = car.velocity * Math.cos(car.rotation);
    car.velocityZ = car.velocity * Math.sin(car.rotation);
    
    // Update position
    car.x += car.velocityX * dt;
    car.z += car.velocityZ * dt;
    
    // Handle steering with realistic physics
    if (Math.abs(car.steering) > 0.1) {
      const steeringForce = car.steering * car.velocity * 0.5;
      const weightTransfer = car.acceleration * PHYSICS.WEIGHT_TRANSFER;
      
      // Front tire grip affects steering
      const frontGrip = PHYSICS.TIRE_GRIP_FRONT - weightTransfer;
      const rearGrip = PHYSICS.TIRE_GRIP_REAR + weightTransfer;
      
      // Calculate rotation based on steering and grip
      const rotationRate = (steeringForce * frontGrip) / (car.weight * car.velocity);
      car.rotation += rotationRate * dt;
      
      // Handbrake for drift initiation
      if (car.handbrake && car.velocity > PHYSICS.DRIFT_SPEED_THRESHOLD) {
        car.rotation += steeringForce * 2 * dt; // Sharp rotation
      }
    }
    
    // Calculate drift angle
    const currentDriftAngle = calculateDriftAngle(car);
    car.driftAngle = currentDriftAngle;
    
    // Drift state management
    if (currentDriftAngle > PHYSICS.DRIFT_ANGLE_THRESHOLD && car.velocity > PHYSICS.DRIFT_SPEED_THRESHOLD) {
      if (!car.isDrifting) {
        car.isDrifting = true;
        car.driftStartTime = Date.now();
        car.driftPoints = 0;
      }
      
      // Calculate drift points
      const driftDuration = (Date.now() - car.driftStartTime) / 1000;
      const pointsPerSecond = (car.velocity * currentDriftAngle * car.comboMultiplier) / 100;
      car.driftPoints += pointsPerSecond * dt;
      
      // Update UI state
      setDriftAngle(Math.round(currentDriftAngle));
      setComboMultiplier(car.comboMultiplier);
      setCurrentScore(Math.round(car.driftPoints));
    } else {
      if (car.isDrifting) {
        // End drift and bank points
        car.isDrifting = false;
        setTotalScore(prev => prev + car.driftPoints);
        setCurrentScore(0);
        
        // Increase combo multiplier for next drift
        car.comboMultiplier = Math.min(car.comboMultiplier + 0.1, 3.0);
        setComboMultiplier(car.comboMultiplier);
      }
    }
    
    // Reset combo if not drifting for too long
    if (!car.isDrifting && car.comboMultiplier > 1) {
      setTimeout(() => {
        car.comboMultiplier = 1;
        setComboMultiplier(1);
      }, 3000);
    }
    
    // Update UI
    setSpeed(Math.round(car.velocity * 3.6)); // Convert to km/h
    setRpm(Math.round(car.rpm));
    setGear(car.gear);
    
    // Gear shifting
    if (car.rpm > 7500 && car.gear < 6) {
      car.gear++;
      car.rpm = 4000;
      setGear(car.gear);
    } else if (car.rpm < 1500 && car.gear > 1) {
      car.gear--;
      car.rpm = 6000;
      setGear(car.gear);
    }
    
    // Boundary checking
    if (car.x < -100) car.x = -100;
    if (car.x > 100) car.x = 100;
    if (car.z < -100) car.z = -100;
    if (car.z > 100) car.z = 100;
  }, [calculateDriftAngle]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = Date.now();
    let keys: { [key: string]: boolean } = {};
    
    // Initialize car
    let car = initializeCar();
    
    // Game loop
    const gameLoop = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Handle input
      car.throttle = keys['w'] || keys['arrowup'] ? 1 : 0;
      car.brake = keys['s'] || keys['arrowdown'] ? 1 : 0;
      car.steering = 0;
      if (keys['a'] || keys['arrowleft']) car.steering = -1;
      if (keys['d'] || keys['arrowright']) car.steering = 1;
      car.handbrake = keys[' '] || false;
      
      // Update physics
      updateCarPhysics(car, deltaTime);
      
      // Render game
      renderGame(ctx, car);
      
      animationId = requestAnimationFrame(gameLoop);
    };

    // Render function
    const renderGame = (ctx: CanvasRenderingContext2D, car: CarPhysics) => {
      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 800, 600);
      
      // Draw track (simple representation)
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, 700, 500);
      
      // Draw car (top-down view)
      ctx.save();
      ctx.translate(400, 300);
      ctx.rotate(car.rotation);
      
      // Car body
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(-20, -12, 40, 24);
      
      // Car details
      ctx.fillStyle = '#4444ff';
      ctx.fillRect(-15, -8, 30, 16);
      
      // Wheels
      ctx.fillStyle = '#333';
      ctx.fillRect(-18, -15, 8, 8);
      ctx.fillRect(10, -15, 8, 8);
      ctx.fillRect(-18, 7, 8, 8);
      ctx.fillRect(10, 7, 8, 8);
      
      ctx.restore();
      
      // Draw drift smoke if drifting
      if (car.isDrifting) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        for (let i = 0; i < 10; i++) {
          const smokeX = 400 + Math.random() * 100 - 50;
          const smokeY = 300 + Math.random() * 100 - 50;
          ctx.beginPath();
          ctx.arc(smokeX, smokeY, Math.random() * 20 + 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Draw HUD
      drawHUD(ctx, car);
    };

    // Draw HUD
    const drawHUD = (ctx: CanvasRenderingContext2D, car: CarPhysics) => {
      // Top-left: Score
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 200, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Drift Score: ${Math.round(car.driftPoints)}`, 20, 30);
      ctx.fillText(`Total Score: ${totalScore}`, 20, 50);
      ctx.fillText(`Combo: x${car.comboMultiplier.toFixed(1)}`, 20, 70);
      
      // Top-center: Drift info
      if (car.isDrifting) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(300, 10, 200, 60);
        ctx.fillStyle = '#00ff00';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`DRIFTING!`, 400, 35);
        ctx.fillText(`Angle: ${Math.round(car.driftAngle)}°`, 400, 60);
      }
      
      // Bottom-center: Tachometer and speedometer
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(300, 500, 200, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Speed: ${speed} km/h`, 400, 525);
      ctx.fillText(`Gear: ${gear}`, 400, 550);
      ctx.fillText(`RPM: ${rpm}`, 400, 575);
    };

    // Event listeners for input
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Start game loop
    animationId = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameState, initializeCar, updateCarPhysics]);

  const startGame = () => {
    setGameState('playing');
  };

  const openGarage = () => {
    setGameState('garage');
  };

  const openTuning = () => {
    setGameState('tuning');
  };

  const openTrackSelect = () => {
    setGameState('trackSelect');
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-purple-400 mb-8">PIXEL-VELOCITY</h1>
          <p className="text-xl text-gray-300 mb-12">3D Drift Simulator</p>
          
          <div className="space-y-4">
            <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
              <Play className="w-6 h-6 mr-2" />
              START DRIFTING
            </Button>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={openGarage} variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10 px-6 py-3">
                <Car className="w-5 h-5 mr-2" />
                GARAGE
              </Button>
              
              <Button onClick={openTuning} variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10 px-6 py-3">
                <Wrench className="w-5 h-5 mr-2" />
                TUNING
              </Button>
              
              <Button onClick={openTrackSelect} variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/10 px-6 py-3">
                <Mountain className="w-5 h-5 mr-2" />
                TRACKS
              </Button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-purple-400 font-bold">CASH: ${cash.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'garage') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-purple-400">GARAGE</h1>
            <Button onClick={backToMenu} variant="outline" className="border-purple-400 text-purple-400">
              Back to Menu
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Car Selection Cards */}
            <Card className="bg-gray-800 border-2 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">Drift King</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Perfect for beginners</p>
                <div className="space-y-2 text-sm">
                  <p>Engine: 300 HP</p>
                  <p>Weight: 1500 kg</p>
                  <p>Price: $5,000</p>
                </div>
                <Button className="w-full mt-4 bg-purple-600">Select Car</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-2 border-blue-400">
              <CardHeader>
                <CardTitle className="text-blue-300">Speed Demon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">High-speed drifting</p>
                <div className="space-y-2 text-sm">
                  <p>Engine: 450 HP</p>
                  <p>Weight: 1400 kg</p>
                  <p>Price: $12,000</p>
                </div>
                <Button className="w-full mt-4 bg-blue-600">Select Car</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-2 border-green-400">
              <CardHeader>
                <CardTitle className="text-green-300">Ultimate Drifter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Professional grade</p>
                <div className="space-y-2 text-sm">
                  <p>Engine: 600 HP</p>
                  <p>Weight: 1300 kg</p>
                  <p>Price: $25,000</p>
                </div>
                <Button className="w-full mt-4 bg-green-600">Select Car</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'tuning') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-purple-400">TUNING</h1>
            <Button onClick={backToMenu} variant="outline" className="border-purple-400 text-purple-400">
              Back to Menu
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-2 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">Engine Tuning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-300">Turbo Pressure</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
                <div>
                  <label className="text-gray-300">Fuel Injection</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
                <div>
                  <label className="text-gray-300">Exhaust Flow</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-2 border-blue-400">
              <CardHeader>
                <CardTitle className="text-blue-300">Suspension Tuning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-300">Ride Height</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
                <div>
                  <label className="text-gray-300">Front Camber</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
                <div>
                  <label className="text-gray-300">Rear Camber</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'trackSelect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-purple-400">TRACK SELECTION</h1>
            <Button onClick={backToMenu} variant="outline" className="border-purple-400 text-purple-400">
              Back to Menu
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-2 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">City Streets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Urban drifting environment</p>
                <Button onClick={startGame} className="w-full bg-purple-600">Select Track</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-2 border-blue-400">
              <CardHeader>
                <CardTitle className="text-blue-300">Mountain Pass</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Touge-style drifting</p>
                <Button onClick={startGame} className="w-full bg-blue-600">Select Track</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-2 border-green-400">
              <CardHeader>
                <CardTitle className="text-green-300">Race Circuit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Professional racing track</p>
                <Button onClick={startGame} className="w-full bg-green-400">Select Track</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Game Canvas */}
      <div className="relative">
        <canvas 
          ref={canvasRef}
          width="800" 
          height="600" 
          className="w-full h-auto border-4 border-purple-400"
        />
        
        {/* Game Overlay */}
        <div className="absolute top-4 left-4">
          <Button onClick={backToMenu} variant="outline" className="border-purple-400 text-purple-400">
            Menu
          </Button>
        </div>
      </div>
      
      {/* Game Instructions */}
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">CONTROLS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white font-bold">W / ↑</p>
            <p className="text-gray-400">Accelerate</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white font-bold">S / ↓</p>
            <p className="text-gray-400">Brake/Reverse</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white font-bold">A / ←</p>
            <p className="text-gray-400">Steer Left</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white font-bold">D / →</p>
            <p className="text-gray-400">Steer Right</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white font-bold">SPACEBAR</p>
            <p className="text-gray-400">Handbrake</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelVelocityPage;
