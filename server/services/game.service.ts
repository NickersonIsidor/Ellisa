import GameModel from '../models/games.model';
import {
  FindGameQuery,
  GameInstance,
  GameInstanceID,
  GamesResponse,
  GameState,
  GameStatus,
  GameType,
} from '../types/types';

/**
 * Retrieves games from the database based on the specified game type and status.
 * @param {GameType | undefined} gameType - The type of the game to filter by (e.g., 'Nim').
 * @param {GameStatus | undefined} status - The status of the game to filter by (e.g., 'IN_PROGRESS').
 * @returns {Promise<GamesResponse>} - A promise resolving to a list of games matching the query.
 */
const findGames = async (
  gameType: GameType | undefined,
  status: GameStatus | undefined,
): Promise<GamesResponse> => {
  const query: FindGameQuery = {};

  // Build database query based on provided filters
  if (gameType) {
    query.gameType = gameType;
  }

  if (status) {
    query['state.status'] = status;
  }

  try {
    const games: GameInstance<GameState>[] = await GameModel.find(query).lean();

    if (games === null) {
      throw new Error('No games found');
    }

    // Format and return the games in reverse order (most recent first)
    return games
      .map(game => ({
        state: game.state as GameState,
        gameID: game.gameID as GameInstanceID,
        players: game.players as string[],
        gameType: game.gameType as GameType,
      }))
      .reverse();
  } catch (error) {
    return [];
  }
};

export default findGames;
