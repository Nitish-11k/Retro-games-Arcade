
export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  dataAiHint: string;
  instructions?: string;
}

export interface Score {
  id: string;
  gameId: string;
  gameTitle: string;
  player: string;
  points: number;
  rank: number;
}
