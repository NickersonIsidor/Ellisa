import { Request } from 'express';

/**
 * Type representing the possible game types as a literal.
 * This is derived from the GAME_TYPES constant.
 */
export type GameType = 'Nim';

/**
 * Type representing the unique identifier for a game instance.
 */
export type GameInstanceID = string;

/**
 * Type representing the possible statuses of a game.
 * - `IN_PROGRESS`: The game is ongoing.
 * - `WAITING_TO_START`: The game is waiting for players to join or ready up.
 * - `OVER`: The game has finished.
 */
export type GameStatus = 'IN_PROGRESS' | 'WAITING_TO_START' | 'OVER';

/**
 * Interface representing the state of a game, which includes:
 * - `status`: The current status of the game.
 */
export interface GameState {
  status: GameStatus;
}

/**
 * Interface representing a game instance, which contains:
 * - `state`: The current state of the game, defined by `GameState`.
 * - `gameID`: The unique identifier for the game instance.
 * - `players`: An array of player IDs participating in the game.
 * - `gameType`: The type of game (e.g., 'Nim').
 */
export interface GameInstance<T extends GameState> {
  state: T;
  gameID: GameInstanceID;
  players: string[];
  gameType: GameType;
}

/**
 * Interface extending `GameState` to represent a game state that has winners.
 * - `winners`: An optional array of player IDs who have won the game.
 */
export interface WinnableGameState extends GameState {
  winners?: ReadonlyArray<string>;
}

/**
 * Interface representing a move in the game, which contains:
 * - `playerID`: The ID of the player making the move.
 * - `gameID`: The ID of the game where the move is being made.
 * - `move`: The actual move made by the player, which can vary depending on the game type.
 */
export interface GameMove<MoveType> {
  playerID: string;
  gameID: GameInstanceID;
  move: MoveType;
}

/**
 * Base interface for moves. Other game-specific move types should extend this.
 */
export interface BaseMove {}

/**
 * Interface representing a move in a Nim game.
 * - `numObjects`: The number of objects the player wants to remove from the game.
 */
export interface NimMove extends BaseMove {
  numObjects: number;
}

/**
 * Interface representing the state of a Nim game, which includes:
 * - `moves`: A list of moves made in the game.
 * - `player1`: The ID of the first player.
 * - `player2`: The ID of the second player.
 * - `remainingObjects`: The number of objects remaining in the game.
 */
export interface NimGameState extends WinnableGameState {
  moves: ReadonlyArray<NimMove>;
  player1?: string;
  player2?: string;
  remainingObjects: number;
}

/**
 * Interface extending the request body when creating a game, which contains:
 * - `gameType`: The type of game to be created (e.g., 'Nim').
 */
export interface CreateGameRequest extends Request {
  body: {
    gameType: GameType;
  };
}

/**
 * Interface extending the request query parameters when retrieving games,
 * which contains:
 * - `gameType`: The type of game.
 * - `status`: The status of the game (e.g., 'IN_PROGRESS', 'WAITING_TO_START').
 */
export interface GetGamesRequest extends Request {
  query: {
    gameType: GameType;
    status: GameStatus;
  };
}

/**
 * Interface extending the request body when performing a game-related action,
 * which contains:
 * - `gameID`: The ID of the game being interacted with.
 * - `playerID`: The ID of the player performing the action (e.g., making a move).
 */
export interface GameRequest extends Request {
  body: {
    gameID: GameInstanceID;
    playerID: string;
  };
}

/**
 * Interface for querying games based on game type and status.
 * - `gameType`: The type of game to query (e.g., 'Nim').
 * - `state.status`: The status of the game (e.g., 'IN_PROGRESS').
 */
export interface FindGameQuery {
  'gameType'?: GameType;
  'state.status'?: GameStatus;
}

/**
 * Type representing the list of game instances.
 * This is typically used in responses to return multiple games.
 */
export type GamesResponse = GameInstance<GameState>[];
