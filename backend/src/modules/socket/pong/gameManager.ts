// gameManager.ts

export const games = new Map<string, Game>();
export const paddleDirections = new Map();

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

interface PlayerSock {
  name: string;
  sockId: string;
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

interface AddPlayerToGameProps {
  roomId: string;
  playerName: string;
  socketId: string;
}

/**
 * Create a new game with initial state and store it in the games map
 */
export function createGame(roomId: string): void {
  const initialState: GameState = {
    ball: {
      x: 600 / 2,
      y: 400 / 2,
      dx: 3,
      dy: 3,
    },
    paddles: {
      left: 400 / 2 - 70 / 2,
      right: 400 / 2 - 70 / 2,
    },
    score: {
      left: 0,
      right: 0,
    },
  };

  games.set(roomId, {
    players: [],
    playerNamesAndsockId: [],
    gameType:null,
    readyPlayers:[],
    ready: false,
    state: initialState,
    round: null,
  });
}

/**
 * Retrieve the game object by roomId
 */
export function getGame(roomId: string): Game | undefined {
  return games.get(roomId);
}

/**
 * Add a player to a game if there's space and not already added
 */
export function addPlayerToGame({ roomId, playerName, socketId }: AddPlayerToGameProps): boolean {
  const game = games.get(roomId);
  if (!game) return false;
  if (game.players.length >= 2) return false;
  if (game.players.includes(playerName)) return false;

  game.players.push(playerName);
  game.playerNamesAndsockId.push({
    name: playerName,
    sockId: socketId,
  });
  return true;
}