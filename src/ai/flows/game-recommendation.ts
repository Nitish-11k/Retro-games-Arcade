'use server';

/**
 * @fileOverview A personalized game recommendation AI agent.
 *
 * - getGameRecommendations - A function that handles the game recommendation process.
 * - GameRecommendationInput - The input type for the getGameRecommendations function.
 * - GameRecommendationOutput - The return type for the getGameRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GameRecommendationInputSchema = z.object({
  userGameplayHistory: z
    .string()
    .describe("A summary of the user's past gameplay history, including games played, genres preferred, and any specific preferences."),
  numberOfRecommendations: z.number().describe('The number of game recommendations to provide.'),
});
export type GameRecommendationInput = z.infer<typeof GameRecommendationInputSchema>;

const GameRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      gameTitle: z.string().describe('The title of the recommended game.'),
      gameGenre: z.string().describe('The genre of the recommended game.'),
      shortDescription: z.string().describe('A short description of the recommended game.'),
    })
  ).describe('An array of game recommendations based on the user gameplay history.'),
});
export type GameRecommendationOutput = z.infer<typeof GameRecommendationOutputSchema>;

export async function getGameRecommendations(input: GameRecommendationInput): Promise<GameRecommendationOutput> {
  return gameRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gameRecommendationPrompt',
  input: {schema: GameRecommendationInputSchema},
  output: {schema: GameRecommendationOutputSchema},
  prompt: `You are an AI game recommender. You will analyze the user's past gameplay history and provide personalized game recommendations.

User Gameplay History: {{{userGameplayHistory}}}

Please provide {{numberOfRecommendations}} game recommendations, formatted as a JSON array of objects with gameTitle, gameGenre, and shortDescription fields. Make up all details. Each game should be suitable for a retro arcade setting.
`,
});

const gameRecommendationFlow = ai.defineFlow(
  {
    name: 'gameRecommendationFlow',
    inputSchema: GameRecommendationInputSchema,
    outputSchema: GameRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
