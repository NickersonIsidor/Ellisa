import NimModel from '../../../models/nim.model';
import GameManager from '../../../services/games/gameManager';
import NimGame from '../../../services/games/nim';
import { MAX_NIM_OBJECTS } from '../../../types/constants';
import { GameInstance, GameInstanceID, NimGameState, GameType } from '../../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'testGameID'), // Mock the return value
}));

describe('GameManager', () => {
  afterEach(() => {
    GameManager.resetInstance(); // Call the reset method
  });

  describe('constructor', () => {
    it('should create a singleton instance of GameManager', () => {
      const gameManager = GameManager.getInstance();

      // Object references should be the same
      expect(GameManager.getInstance()).toBe(gameManager);
    });
  });

  describe('resetInstance', () => {
    it('should reset the singleton instance of GameManager', () => {
      const gameManager1 = GameManager.getInstance();

      GameManager.resetInstance();

      const gameManager2 = GameManager.getInstance();

      expect(gameManager1).not.toBe(gameManager2);
    });
  });

  describe('addGame', () => {
    const mapSetSpy = jest.spyOn(Map.prototype, 'set');

    it('should return the gameID for a successfully created game', async () => {
      mockingoose(NimModel).toReturn(new NimGame().toModel(), 'create');

      const gameManager = GameManager.getInstance();
      const gameID = await gameManager.addGame('Nim');

      expect(gameID).toEqual('testGameID');
      expect(mapSetSpy).toHaveBeenCalledWith(gameID, expect.any(NimGame));
    });

    it('should return an error for an invalid game type', async () => {
      const gameManager = GameManager.getInstance();
      // casting string for error testing purposes
      const error = await gameManager.addGame('fakeGame' as GameType);

      expect(mapSetSpy).not.toHaveBeenCalled();
      expect(error).toHaveProperty('error');
      expect(error).toEqual({ error: 'Invalid game type' });
    });

    it('should return an error for a database error', async () => {
      jest.spyOn(NimModel, 'create').mockRejectedValueOnce(() => new Error('database error'));

      const gameManager = GameManager.getInstance();
      // casting string for error testing purposes
      const error = await gameManager.addGame('Nim');

      expect(mapSetSpy).not.toHaveBeenCalled();
      expect(error).toHaveProperty('error');
    });
  });

  describe('removeGame', () => {
    const mapDeleteSpy = jest.spyOn(Map.prototype, 'delete');

    it('should remove the game with the provided gameID', async () => {
      mockingoose(NimModel).toReturn(new NimGame().toModel(), 'create');

      // assemble
      const gameManager = GameManager.getInstance();
      const gameID = await gameManager.addGame('Nim');
      expect(gameManager.getActiveGameInstances().length).toEqual(1);

      if (typeof gameID === 'string') {
        // act
        const removed = gameManager.removeGame(gameID);

        // assess
        expect(removed).toBeTruthy();
        expect(gameManager.getActiveGameInstances().length).toEqual(0);
        expect(mapDeleteSpy).toHaveBeenCalledWith(gameID);
      }
    });

    it('should return false if there is no game with the provided gameID', async () => {
      // assemble
      const gameManager = GameManager.getInstance();
      const gameID = 'fakeGameID';

      // act
      const removed = gameManager.removeGame(gameID);

      // assess
      expect(removed).toBeFalsy();
      expect(mapDeleteSpy).toHaveBeenCalledWith(gameID);
    });
  });

  describe('joinGame', () => {
    let gameManager: GameManager;
    let gameID: GameInstanceID;

    beforeEach(async () => {
      mockingoose(NimModel).toReturn(new NimGame().toModel(), 'create');

      gameManager = GameManager.getInstance();
      const addGameResult = await gameManager.addGame('Nim');

      if (typeof addGameResult === 'string') {
        gameID = addGameResult;
      }
    });

    it('should join the requested game', async () => {
      const gameState: GameInstance<NimGameState> = {
        state: {
          moves: [],
          player1: 'player1',
          status: 'WAITING_TO_START',
          remainingObjects: MAX_NIM_OBJECTS,
        },
        gameID,
        players: ['player1'],
        gameType: 'Nim',
      };

      const saveGameStateSpy = jest
        .spyOn(NimGame.prototype, 'saveGameState')
        .mockResolvedValueOnce();
      const nimGameJoinSpy = jest.spyOn(NimGame.prototype, 'join');

      const gameJoined = await gameManager.joinGame(gameID, 'player1');

      expect(saveGameStateSpy).toHaveBeenCalled();
      expect(nimGameJoinSpy).toHaveBeenCalledWith('player1');
      expect(gameJoined).toEqual(gameState);
    });

    it('should throw an error if the game does not exist', async () => {
      const response = await gameManager.joinGame('fakeGameID', 'player1');

      expect(response).toEqual({ error: 'Game requested does not exist.' });
    });
  });

  describe('leaveGame', () => {
    let gameManager: GameManager;
    let gameID: GameInstanceID;

    beforeEach(async () => {
      mockingoose(NimModel).toReturn(new NimGame().toModel(), 'create');

      gameManager = GameManager.getInstance();
      const addGameResult = await gameManager.addGame('Nim');

      if (typeof addGameResult === 'string') {
        gameID = addGameResult;
        await gameManager.joinGame(gameID, 'player1');
      }
    });

    it('should leave the requested game', async () => {
      const gameState: GameInstance<NimGameState> = {
        state: {
          moves: [],
          status: 'WAITING_TO_START',
          remainingObjects: MAX_NIM_OBJECTS,
        },
        gameID,
        players: [],
        gameType: 'Nim',
      };

      const saveGameStateSpy = jest
        .spyOn(NimGame.prototype, 'saveGameState')
        .mockResolvedValueOnce();
      const nimGameLeaveSpy = jest.spyOn(NimGame.prototype, 'leave');

      const gameLeft = await gameManager.leaveGame(gameID, 'player1');

      expect(saveGameStateSpy).toHaveBeenCalled();
      expect(nimGameLeaveSpy).toHaveBeenCalledWith('player1');
      expect(gameLeft).toEqual(gameState);
    });

    it('should leave and remove the requested game if it ends', async () => {
      // assemble
      await gameManager.joinGame(gameID, 'player2');

      const gameState: GameInstance<NimGameState> = {
        state: {
          moves: [],
          status: 'OVER',
          player1: undefined,
          player2: 'player2',
          winners: ['player2'],
          remainingObjects: MAX_NIM_OBJECTS,
        },
        gameID: 'testGameID',
        players: ['player2'],
        gameType: 'Nim',
      };
      const saveGameStateSpy = jest
        .spyOn(NimGame.prototype, 'saveGameState')
        .mockResolvedValueOnce();
      const nimGameLeaveSpy = jest.spyOn(NimGame.prototype, 'leave');
      const removeGameSpy = jest.spyOn(gameManager, 'removeGame');

      const gameLeft = await gameManager.leaveGame(gameID, 'player1');

      expect(saveGameStateSpy).toHaveBeenCalled();
      expect(nimGameLeaveSpy).toHaveBeenCalledWith('player1');
      expect(removeGameSpy).toHaveBeenLastCalledWith(gameID);
      expect(gameLeft).toEqual(gameState);
    });

    it('should throw an error if the game does not exist', async () => {
      const response = await gameManager.leaveGame('fakeGameID', 'player1');

      expect(response).toEqual({ error: 'Game requested does not exist.' });
    });
  });

  describe('getGame', () => {
    let gameManager: GameManager;
    const mapGetSpy = jest.spyOn(Map.prototype, 'get');

    beforeEach(() => {
      gameManager = GameManager.getInstance();
    });

    it('should return the game if it exists', async () => {
      // assemble
      mockingoose(NimModel).toReturn(new NimGame().toModel(), 'create');

      const gameID = await gameManager.addGame('Nim');

      if (typeof gameID === 'string') {
        // act
        const game = gameManager.getGame(gameID);

        expect(game).toBeInstanceOf(NimGame);
        expect(mapGetSpy).toHaveBeenCalledWith(gameID);
      }
    });

    it('should return undefined if the game request does not exist', () => {
      const gameID = 'fakeGameID';
      const game = gameManager.getGame(gameID);

      expect(game).toBeUndefined();
      expect(mapGetSpy).toHaveBeenCalledWith(gameID);
    });
  });

  describe('getActiveGameInstances', () => {
    it('should be empty on initialization', () => {
      const games = GameManager.getInstance().getActiveGameInstances();
      expect(games.length).toEqual(0);
    });

    it('should return active games', async () => {
      mockingoose(NimModel).toReturn(new NimGame().toModel(), 'create');
      // assemble
      const gameManager = GameManager.getInstance();
      await gameManager.addGame('Nim');

      // act
      const games = gameManager.getActiveGameInstances();
      expect(games.length).toEqual(1);
      expect(games[0]).toBeInstanceOf(NimGame);
    });
  });
});
