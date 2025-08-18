'use client';

import { useState } from 'react';
import { getGameRecommendations, type GameRecommendationOutput } from '@/ai/flows/game-recommendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Gamepad2, ThumbsUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AiRecommender() {
  const [history, setHistory] = useState('');
  const [recommendations, setRecommendations] = useState<GameRecommendationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRecommendation = async () => {
    if (!history.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please tell me about games you like first!',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setRecommendations(null);
    try {
      const result = await getGameRecommendations({
        userGameplayHistory: history,
        numberOfRecommendations: 3,
      });
      setRecommendations(result);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: 'AI Error',
        description: 'The AI is taking a break. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          <div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-headline">AI Game Recommender</CardTitle>
            <CardDescription className="text-sm sm:text-base">Don't know what to play? Let our AI suggest your next favorite game!</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <label htmlFor="game-history" className="font-body text-sm">
            Describe games or genres you enjoy...
          </label>
          <Textarea
            id="game-history"
            placeholder="e.g., I love fast-paced space shooters and puzzle games with falling blocks..."
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            rows={3}
            disabled={loading}
            className="text-sm sm:text-base"
          />
        </div>
        <Button onClick={handleRecommendation} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3">
          {loading ? 'Thinking...' : 'Get Recommendations'}
        </Button>

        {loading && (
          <div className="space-y-3 sm:space-y-4 pt-4">
            <Skeleton className="h-20 sm:h-24 w-full" />
            <Skeleton className="h-20 sm:h-24 w-full" />
            <Skeleton className="h-20 sm:h-24 w-full" />
          </div>
        )}

        {recommendations && (
          <div className="pt-4 space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-headline flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Here are your top picks:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recommendations.recommendations.map((rec) => (
                <Card key={rec.gameTitle} className="bg-background/50">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-sm sm:text-base">
                      <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" /> {rec.gameTitle}
                    </CardTitle>
                    <CardDescription className="font-body text-xs pt-1">{rec.gameGenre}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <p className="text-xs sm:text-sm text-foreground/80">{rec.shortDescription}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
