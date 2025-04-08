import GameModel from '../../models/games.model';
import findGames from '../../services/game.service';
import { MAX_NIM_OBJECTS } from '../../types/constants';
import { GameInstance, NimGameState } from '../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const gameState1: GameInstance<NimGameState> = {
  state: { moves: [], status: 'WAITING_TO_START', remainingObjects: MAX_NIM_OBJECTS },
  gameID: 'testGameID1',
  players: ['user1'],
  gameType: 'Nim',
};

const gameState2: GameInstance<NimGameState> = {
  state: { moves: [], status: 'IN_PROGRESS', remainingObjects: MAX_NIM_OBJECTS },
  gameID: 'testGameID2',
  players: ['user1', 'user2'],
  gameType: 'Nim',
};

const gameState3: GameInstance<NimGameState> = {
  state: { moves: [], status: 'OVER', winners: ['user1'], remainingObjects: MAX_NIM_OBJECTS },
  gameID: 'testGameID3',
  players: ['user1', 'user2'],
  gameType: 'Nim',
};

const gameModelFindSpy = jest.spyOn(GameModel, 'find');

describe('findGames', () => {
  it('should return all games when provided undefined arguments', async () => {
    mockingoose(GameModel).toReturn([gameState1, gameState2, gameState3], 'find');

    const games = await findGames(undefined, undefined);

    expect(games).toEqual([gameState3, gameState2, gameState1]);
    expect(gameModelFindSpy).toHaveBeenCalledWith({});
  });

  it('should return games with the matching gameType', async () => {
    mockingoose(GameModel).toReturn([gameState1, gameState2, gameState3], 'find');

    const games = await findGames('Nim', undefined);

    expect(games).toEqual([gameState3, gameState2, gameState1]);
    expect(gameModelFindSpy).toHaveBeenCalledWith({ gameType: 'Nim' });
  });

  it('should return games with the matching status', async () => {
    mockingoose(GameModel).toReturn([gameState2], 'find');

    const games = await findGames(undefined, 'IN_PROGRESS');

    expect(games).toEqual([gameState2]);
    expect(gameModelFindSpy).toHaveBeenCalledWith({ 'state.status': 'IN_PROGRESS' });
  });

  it('should return games with the matching gameType and status', async () => {
    mockingoose(GameModel).toReturn([gameState3], 'find');

    const games = await findGames('Nim', 'OVER');

    expect(games).toEqual([gameState3]);
    expect(gameModelFindSpy).toHaveBeenCalledWith({ 'gameType': 'Nim', 'state.status': 'OVER' });
  });

  it('should return an empty list for database error', async () => {
    mockingoose(GameModel).toReturn(new Error('database error'), 'find');

    const games = await findGames(undefined, undefined);

    expect(games).toEqual([]);
    expect(gameModelFindSpy).toHaveBeenCalledWith({});
  });

  it('should return an empty list for no games found', async () => {
    mockingoose(GameModel).toReturn(null, 'find');

    const games = await findGames(undefined, undefined);

    expect(games).toEqual([]);
    expect(gameModelFindSpy).toHaveBeenCalledWith({});
  });
});
