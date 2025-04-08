import GameModel from '../../../models/games.model';
import NimGame from '../../../services/games/nim';
import { MAX_NIM_OBJECTS } from '../../../types/constants';
import { GameInstance, GameMove, NimGameState, NimMove } from '../../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('NimGame tests', () => {
  let nimGame: NimGame;

  beforeEach(() => {
    nimGame = new NimGame();
  });

  describe('constructor', () => {
    it('creates a blank game', () => {
      expect(nimGame.id).toBeDefined();
      expect(nimGame.id).toEqual(expect.any(String));
      expect(nimGame.state.status).toBe('WAITING_TO_START');
      expect(nimGame.state.moves).toEqual([]);
      expect(nimGame.state.player1).toBeUndefined();
      expect(nimGame.state.player2).toBeUndefined();
      expect(nimGame.state.winners).toBeUndefined();
      expect(nimGame.state.remainingObjects).toEqual(MAX_NIM_OBJECTS);
      expect(nimGame.gameType).toEqual('Nim');
    });
  });

  describe('toModel', () => {
    it('should return a representation of the current game state', () => {
      const gameState: GameInstance<NimGameState> = {
        state: {
          moves: [],
          status: 'WAITING_TO_START',
          remainingObjects: MAX_NIM_OBJECTS,
        },
        gameID: expect.any(String),
        players: [],
        gameType: 'Nim',
      };

      expect(nimGame.toModel()).toEqual(gameState);
    });

    it('should return a representation of the current game state', () => {
      const gameState1: GameInstance<NimGameState> = {
        state: {
          moves: [],
          status: 'WAITING_TO_START',
          player1: 'player1',
          remainingObjects: MAX_NIM_OBJECTS,
        },
        gameID: expect.any(String),
        players: ['player1'],
        gameType: 'Nim',
      };

      const gameState2: GameInstance<NimGameState> = {
        state: {
          moves: [],
          status: 'IN_PROGRESS',
          player1: 'player1',
          player2: 'player2',
          remainingObjects: MAX_NIM_OBJECTS,
        },
        gameID: expect.any(String),
        players: ['player1', 'player2'],
        gameType: 'Nim',
      };

      const gameState3: GameInstance<NimGameState> = {
        state: {
          moves: [],
          status: 'OVER',
          player1: undefined,
          player2: 'player2',
          winners: ['player2'],
          remainingObjects: MAX_NIM_OBJECTS,
        },
        gameID: expect.any(String),
        players: ['player2'],
        gameType: 'Nim',
      };

      nimGame.join('player1');

      expect(nimGame.toModel()).toEqual(gameState1);

      nimGame.join('player2');

      expect(nimGame.toModel()).toEqual(gameState2);

      nimGame.leave('player1');

      expect(nimGame.toModel()).toEqual(gameState3);
    });
  });

  describe('join', () => {
    it('adds player1 to the game', () => {
      expect(nimGame.state.player1).toBeUndefined();

      nimGame.join('player1');

      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.status).toEqual('WAITING_TO_START');
    });

    it('adds player2 to the game and sets the game status to IN_PROGRESS', () => {
      // assemble
      nimGame.join('player1');
      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.status).toEqual('WAITING_TO_START');

      // act
      nimGame.join('player2');
      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.player2).toEqual('player2');
      expect(nimGame.state.status).toEqual('IN_PROGRESS');
    });

    it('throws an error if trying to join an in progress game', () => {
      // assemble
      nimGame.join('player1');
      nimGame.join('player2');

      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.player2).toEqual('player2');
      expect(nimGame.state.status).toEqual('IN_PROGRESS');

      // act
      expect(() => nimGame.join('player3')).toThrow('Cannot join game: already started');
    });

    it('throws an error if trying to join a completed game', () => {
      // assemble
      nimGame.join('player1');
      nimGame.join('player2');
      nimGame.leave('player2');

      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.player2).toBeUndefined();
      expect(nimGame.state.status).toEqual('OVER');

      // act
      expect(() => nimGame.join('player3')).toThrow('Cannot join game: already started');
    });

    it('throws an error if trying to join a game the player is already in', () => {
      // assemble
      nimGame.join('player1');
      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.status).toEqual('WAITING_TO_START');

      // act
      expect(() => nimGame.join('player1')).toThrow('Cannot join game: player already in game');
    });
  });

  describe('leave', () => {
    it('should remove player 1 from a game waiting to start', () => {
      // assemble
      nimGame.join('player1');
      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.status).toEqual('WAITING_TO_START');

      // act
      nimGame.leave('player1');
      expect(nimGame.state.player1).toBeUndefined();
      expect(nimGame.state.status).toEqual('WAITING_TO_START');
    });

    it('should remove player 1 from a game in progress and set it to over', () => {
      // assemble
      nimGame.join('player1');
      nimGame.join('player2');
      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.player2).toEqual('player2');
      expect(nimGame.state.status).toEqual('IN_PROGRESS');

      // act
      nimGame.leave('player1');
      expect(nimGame.state.player1).toBeUndefined();
      expect(nimGame.state.status).toEqual('OVER');
      expect(nimGame.state.winners).toEqual(['player2']);
    });

    it('should remove player 2 from a game in progress and set it to over', () => {
      // assemble
      nimGame.join('player1');
      nimGame.join('player2');
      expect(nimGame.state.player1).toEqual('player1');
      expect(nimGame.state.player2).toEqual('player2');
      expect(nimGame.state.status).toEqual('IN_PROGRESS');

      // act
      nimGame.leave('player2');
      expect(nimGame.state.player2).toBeUndefined();
      expect(nimGame.state.status).toEqual('OVER');
      expect(nimGame.state.winners).toEqual(['player1']);
    });

    it('throws an error if trying to join a game the player is not in', () => {
      // act
      expect(() => nimGame.leave('player1')).toThrow(
        'Cannot leave game: player player1 is not in the game.',
      );
    });
  });

  describe('saveGameState', () => {
    const findOneAndUpdateSpy = jest.spyOn(GameModel, 'findOneAndUpdate');
    const startGameState: GameInstance<NimGameState> = {
      state: {
        moves: [],
        status: 'WAITING_TO_START',
        remainingObjects: MAX_NIM_OBJECTS,
      },
      gameID: expect.any(String),
      players: [],
      gameType: 'Nim',
    };

    it('should call findOneAndUpdate with the correct model arguments', async () => {
      mockingoose(GameModel).toReturn(startGameState, 'findOneAndUpdate');

      const response = await nimGame.saveGameState();

      expect(response).toBeUndefined();
      expect(findOneAndUpdateSpy).toHaveBeenLastCalledWith(
        { gameID: expect.any(String) },
        startGameState,
        { upsert: true },
      );
    });

    it('should throw a database error', () => {
      findOneAndUpdateSpy.mockRejectedValueOnce(new Error('database error'));

      expect(nimGame.saveGameState()).rejects.toThrow('database error');
    });
  });

  describe('applyMove', () => {
    const player1Move: GameMove<NimMove> = {
      move: { numObjects: 2 },
      playerID: 'player1',
      gameID: 'testGameID',
    };

    beforeEach(() => {
      nimGame.join('player1');
      nimGame.join('player2');
      expect(nimGame.state.status).toEqual('IN_PROGRESS');
      expect(nimGame.state.moves).toEqual([]);
    });

    it('should apply a valid move', () => {
      nimGame.applyMove(player1Move);

      expect(nimGame.state.moves.length).toEqual(1);
      expect(nimGame.state.moves).toEqual([player1Move.move]);
      expect(nimGame.state.status).toEqual('IN_PROGRESS');
      expect(nimGame.state.remainingObjects).toEqual(MAX_NIM_OBJECTS - 2);
    });

    it('should apply a valid move with removing 1 object', () => {
      const borderMove: GameMove<NimMove> = {
        move: { numObjects: 1 },
        playerID: 'player1',
        gameID: 'testGameID',
      };

      nimGame.applyMove(borderMove);

      expect(nimGame.state.moves.length).toEqual(1);
      expect(nimGame.state.moves).toEqual([borderMove.move]);
      expect(nimGame.state.status).toEqual('IN_PROGRESS');
      expect(nimGame.state.remainingObjects).toEqual(MAX_NIM_OBJECTS - 1);
    });

    it('should apply a valid move with removing 3 objects', () => {
      const borderMove: GameMove<NimMove> = {
        move: { numObjects: 3 },
        playerID: 'player1',
        gameID: 'testGameID',
      };

      nimGame.applyMove(borderMove);

      expect(nimGame.state.moves.length).toEqual(1);
      expect(nimGame.state.moves).toEqual([borderMove.move]);
      expect(nimGame.state.status).toEqual('IN_PROGRESS');
      expect(nimGame.state.remainingObjects).toEqual(MAX_NIM_OBJECTS - 3);
    });

    it('should throw an error if the player makes a move out of turn', () => {
      const move: GameMove<NimMove> = {
        move: { numObjects: 2 },
        playerID: 'player2',
        gameID: 'testGameID',
      };

      expect(() => nimGame.applyMove(move)).toThrow('Invalid move: wrong player');
    });

    it('should throw an error if the player makes a move out of turn', () => {
      // assemble
      nimGame.applyMove(player1Move);

      // act + assess
      expect(() => nimGame.applyMove(player1Move)).toThrow('Invalid move: wrong player');
    });

    it('should throw an error if the game is not in progress', () => {
      // assemble
      const newGame = new NimGame();
      newGame.join('player1');

      // act + assess
      expect(newGame.state.status).toEqual('WAITING_TO_START');
      expect(() => newGame.applyMove(player1Move)).toThrow('Invalid move: game is not in progress');
    });

    it('should throw an error if the game is not in progress', () => {
      // assemble
      const newGame = new NimGame();
      newGame.join('player1');
      newGame.join('player2');
      newGame.leave('player2');

      // act + assess
      expect(newGame.state.status).toEqual('OVER');
      expect(() => newGame.applyMove(player1Move)).toThrow('Invalid move: game is not in progress');
    });

    it('should throw an error if the numObjects is less than 1', () => {
      const invalidMoves: GameMove<NimMove>[] = [
        {
          move: { numObjects: 0 },
          playerID: 'player1',
          gameID: 'testGameID',
        },
        {
          move: { numObjects: -1 },
          playerID: 'player1',
          gameID: 'testGameID',
        },
      ];

      invalidMoves.forEach(invalidMove => {
        expect(() => nimGame.applyMove(invalidMove)).toThrow(
          'Invalid move: must remove between 1 and 3 objects',
        );
      });
    });

    it('should throw an error if the numObjects is greater than 3', () => {
      const invalidMoves: GameMove<NimMove>[] = [
        {
          move: { numObjects: 4 },
          playerID: 'player1',
          gameID: 'testGameID',
        },
        {
          move: { numObjects: 100 },
          playerID: 'player1',
          gameID: 'testGameID',
        },
      ];

      invalidMoves.forEach(invalidMove => {
        expect(() => nimGame.applyMove(invalidMove)).toThrow(
          'Invalid move: must remove between 1 and 3 objects',
        );
      });
    });

    describe('applying moves near the end of the game', () => {
      const player2Move: GameMove<NimMove> = {
        move: { numObjects: 3 },
        playerID: 'player2',
        gameID: 'testGameID',
      };

      beforeEach(() => {
        // starts with 21 objects
        nimGame.applyMove(player1Move); // 19
        nimGame.applyMove(player2Move); // 16
        nimGame.applyMove(player1Move); // 14
        nimGame.applyMove(player2Move); // 11
        nimGame.applyMove(player1Move); // 9
        nimGame.applyMove(player2Move); // 6
        nimGame.applyMove(player1Move); // 4
        nimGame.applyMove(player2Move); // 1

        expect(nimGame.state.moves.length).toEqual(8);
        expect(nimGame.state.remainingObjects).toEqual(1);
        // the below tests start with 1 object
      });

      it('should end the game once the player takes the last object(s)', () => {
        const finalMove: GameMove<NimMove> = {
          move: { numObjects: 1 },
          playerID: 'player1',
          gameID: 'testGameID',
        };

        nimGame.applyMove(finalMove);

        expect(nimGame.state.status).toEqual('OVER');
        expect(nimGame.state.winners).toBeDefined();
        expect(nimGame.state.winners).toEqual(['player2']);
        expect(nimGame.state.moves.length).toEqual(9);
        expect(nimGame.state.remainingObjects).toEqual(0);
      });

      it('should throw an error if the player takes more than the remaining objects', () => {
        const finalMove: GameMove<NimMove> = {
          move: { numObjects: 2 },
          playerID: 'player1',
          gameID: 'testGameID',
        };

        expect(() => nimGame.applyMove(finalMove)).toThrow(
          'Invalid move: cannot remove more objects than are left',
        );
      });
    });
  });
});
