// src/modules/tournament/tournamentStore.ts

import { Game } from "./gameManager";

// Type for a single match
export interface Match {
  id: string;
  players: [string, string];
  winner: string | null;
  status: 'pending' | 'in_progress' | 'completed';
}

// Type for a tournament
export interface Tournament {
  id: string;
  name: string;
  date?: string;
  description?: string;
  owner: string;
  ownerPlays: boolean;
  maxPlayers: number;
  players: string[];        // Current active players
  participants: string[] | null;   // All players who have participated
  winners: string[];
  losers: string[];
  currentPlayers: number;
  countdown: number | null;
  matches: Game[];
  roundes: number | null;
  status: 'waiting' | 'in_progress' | 'completed';
}

// In-memory tournament storage
export const tournaments: Record<string, Tournament> = {};
