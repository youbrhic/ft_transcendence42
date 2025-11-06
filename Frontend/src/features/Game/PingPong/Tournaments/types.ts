// src/features/Game/PingPong/Tournaments/types.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export type MatchStatus = "pending" | "playing" | "finished";
export type TournamentStatus = "waiting" | "in_progress" | "finished";

export interface Match {
  id: string;
  round: number;
  players: [string | null, string | null];
  status: MatchStatus | string;
  winner?: string | null;
  roomId?: string;
  score?: Record<string, number>;
}

// export interface Tournament {
//   id: string;
//   name: string;
//   maxPlayers: number;
//   date?: string;
//   description?: string;
//   owner: string;
//   ownerPlays: boolean;
//   players: string[];
//   countdown: number | null,
//   currentPlayers: number;
//   status: TournamentStatus;
//   matches: Match[];
//   champion?: string | null;
//   roomId?: string;
// }

interface PlayerSock {
  name: string;
  sockId: string;
}

interface GameState {
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
  };
  paddles: {
    left: number;
    right: number;
  };
  score: {
    left: number;
    right: number;
  };
}

export interface Game {
  roomId?: string;
  players: string[]; // player names
  playerNamesAndsockId: PlayerSock[];
  gameType:string | null,
  readyPlayers:string[],
  ready: boolean;
  state: GameState;
  winner?: string;
  loser?: string;
  round?: number | null;
  progress?: 'pending' | 'in_progress' | 'completed';
}

export interface Tournament {
  id: string;
  name: string;
  date?: string;
  description?: string;
  owner: string;
  ownerPlays: boolean;
  maxPlayers: number;
  players: string[];        // Current active players
  participants: string[];   // All players who have participated
  winners: string[];
  losers: string[];
  currentPlayers: number;
  countdown: number | null;
  matches: Game[];
  roundes: number | null;
  status: 'waiting' | 'in_progress' | 'completed';
}

export interface UserPlayer {
  id: string;
  username: string;
  online: boolean;
}
