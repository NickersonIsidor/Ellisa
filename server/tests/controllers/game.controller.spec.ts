import supertest from 'supertest';
import { Server, type Socket as ServerSocket } from 'socket.io';
import { Server as HTTPServer, createServer } from 'http';
// import Client from 'socket.io-client';
import io from 'socket.io-client';
// import type { Socket as ClientSocketType } from 'socket.io-client';
import { AddressInfo } from 'net';
import { app } from '../../app';
import GameManager from '../../services/games/gameManager';
import { FakeSOSocket, GameInstance, NimGameState } from '../../types/types';
import * as util from '../../services/game.service';
import gameController from '../../controllers/game.controller';
import NimGame from '../../services/games/nim';
import { MAX_NIM_OBJECTS } from '../../types/constants';

type ClientSocket = ReturnType<typeof io>;

const mockGameManager = GameManager.getInstance();

describe('POST /create', () => {
  const addGameSpy = jest.spyOn(mockGameManager, 'addGame');

  describe('200 OK Requests', () => {
    it('should return 200 with a game ID when successful', async () => {
      addGameSpy.mockResolvedValueOnce('testGameID');

      const response = await supertest(app).post('/games/create').send({ gameType: 'Nim' });

      expect(response.status).toEqual(200);
      expect(response.text).toEqual(JSON.stringify('testGameID'));
      expect(addGameSpy).toHaveBeenCalledWith('Nim');
    });
  });

  describe('400 Invalid Request', () => {
    it('should return 400 for an undefined response body', async () => {
      const response = await supertest(app).post('/games/create').send(undefined);

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });

    it('should return 400 for an empty response body', async () => {
      const response = await supertest(app).post('/games/create').send({});

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });

    it('should return 400 for an invalid game type', async () => {
      const response = await supertest(app).post('/games/create').send({ gameType: 'TicTacToe' });

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });
  });

  describe('500 Server Error Request', () => {
    it('should return 500 if addGame fails', async () => {
      addGameSpy.mockResolvedValueOnce({ error: 'test error' });

      const response = await supertest(app).post('/games/create').send({ gameType: 'Nim' });

      expect(response.status).toEqual(500);
      expect(response.text).toContain('Error when creating game: test error');
      expect(addGameSpy).toHaveBeenCalledWith('Nim');
    });

    it('should return 500 if addGame throws an error', async () => {
      addGameSpy.mockRejectedValueOnce(new Error('test error'));

      const response = await supertest(app).post('/games/create').send({ gameType: 'Nim' });

      expect(response.status).toEqual(500);
      expect(response.text).toContain('Error when creating game: test error');
      expect(addGameSpy).toHaveBeenCalledWith('Nim');
    });
  });
});

describe('POST /join', () => {
  const joinGameSpy = jest.spyOn(mockGameManager, 'joinGame');

  describe('200 OK Requests', () => {
    it('should return 200 with a game state when successful', async () => {
      const gameState: GameInstance<NimGameState> = {
        state: { moves: [], status: 'WAITING_TO_START', remainingObjects: MAX_NIM_OBJECTS },
        gameID: 'testGameID',
        players: ['user1'],
        gameType: 'Nim',
      };
      joinGameSpy.mockResolvedValueOnce(gameState);

      const response = await supertest(app)
        .post('/games/join')
        .send({ gameID: 'testGameID', playerID: 'user1' });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(gameState);
      expect(joinGameSpy).toHaveBeenCalledWith('testGameID', 'user1');
    });
  });

  describe('400 Invalid Request', () => {
    it('should return 400 for an undefined response body', async () => {
      const response = await supertest(app).post('/games/join').send(undefined);

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });

    it('should return 400 for an empty response body', async () => {
      const response = await supertest(app).post('/games/join').send({});

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });

    it('should return 400 for a missing gameID', async () => {
      const response = await supertest(app).post('/games/join').send({ playerID: 'user1' });

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });

    it('should return 400 for a missing playerID', async () => {
      const response = await supertest(app).post('/games/join').send({ gameID: 'testGameID' });

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });
  });

  describe('500 Server Error Request', () => {
    it('should return 500 if joinGame fails', async () => {
      joinGameSpy.mockResolvedValueOnce({ error: 'test error' });

      const response = await supertest(app)
        .post('/games/join')
        .send({ gameID: 'testGameID', playerID: 'user1' });

      expect(response.status).toEqual(500);
      expect(response.text).toContain('Error when joining game: test error');
    });

    it('should return 500 if joinGame throws an error', async () => {
      joinGameSpy.mockRejectedValueOnce(new Error('test error'));

      const response = await supertest(app)
        .post('/games/join')
        .send({ gameID: 'testGameID', playerID: 'user1' });

      expect(response.status).toEqual(500);
      expect(response.text).toContain('Error when joining game: test error');
    });
  });
});

describe('POST /leave', () => {
  const leaveGameSpy = jest.spyOn(mockGameManager, 'leaveGame');

  describe('200 OK Requests', () => {
    it('should return 200 with a success message when successful', async () => {
      const gameState: GameInstance<NimGameState> = {
        state: { moves: [], status: 'OVER', winners: ['user1'], remainingObjects: MAX_NIM_OBJECTS },
        gameID: 'testGameID',
        players: ['user1'],
        gameType: 'Nim',
      };
      leaveGameSpy.mockResolvedValueOnce(gameState);

      const response = await supertest(app)
        .post('/games/leave')
        .send({ gameID: 'testGameID', playerID: 'user1' });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(gameState);
      expect(leaveGameSpy).toHaveBeenCalledWith('testGameID', 'user1');
    });
  });

  describe('400 Invalid Request', () => {
    it('should return 400 for an undefined response body', async () => {
      const response = await supertest(app).post('/games/leave').send(undefined);

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });

    it('should return 400 for an empty response body', async () => {
      const response = await supertest(app).post('/games/leave').send({});

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });

    it('should return 400 for a missing gameID', async () => {
      const response = await supertest(app).post('/games/leave').send({ playerID: 'user1' });

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });

    it('should return 400 for a missing playerID', async () => {
      const response = await supertest(app).post('/games/leave').send({ gameID: 'testGameID' });

      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Invalid request');
    });
  });

  describe('500 Server Error Request', () => {
    it('should return 500 if leaveGame fails', async () => {
      leaveGameSpy.mockResolvedValueOnce({ error: 'test error' });

      const response = await supertest(app)
        .post('/games/leave')
        .send({ gameID: 'testGameID', playerID: 'user1' });

      expect(response.status).toEqual(500);
      expect(response.text).toContain('Error when leaving game: test error');
    });

    it('should return 500 if leaveGame throws an error', async () => {
      leaveGameSpy.mockRejectedValueOnce(new Error('test error'));

      const response = await supertest(app)
        .post('/games/leave')
        .send({ gameID: 'testGameID', playerID: 'user1' });

      expect(response.status).toEqual(500);
      expect(response.text).toContain('Error when leaving game: test error');
    });
  });
});

describe('GET /games', () => {
  // findGames is the default export in the file
  const findGamesSpy = jest.spyOn(util, 'default');
  const gameState: GameInstance<NimGameState> = {
    state: { moves: [], status: 'WAITING_TO_START', remainingObjects: MAX_NIM_OBJECTS },
    gameID: 'testGameID',
    players: ['user1'],
    gameType: 'Nim',
  };

  describe('200 OK Requests', () => {
    it('should return 200 with a game state array when successful', async () => {
      findGamesSpy.mockResolvedValueOnce([gameState]);

      const response = await supertest(app)
        .get('/games/games')
        .query({ gameType: 'Nim', status: 'WAITING_TO_START' });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([gameState]);
      expect(findGamesSpy).toHaveBeenCalledWith('Nim', 'WAITING_TO_START');
    });

    it('should return 200 with an empty game state array when successful', async () => {
      findGamesSpy.mockResolvedValueOnce([]);

      const response = await supertest(app)
        .get('/games/games')
        .query({ gameType: 'Nim', status: 'IN_PROGRESS' });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
      expect(findGamesSpy).toHaveBeenCalledWith('Nim', 'IN_PROGRESS');
    });
  });

  describe('500 Server Error Request', () => {
    it('should return 500 if leaveGame throws an error', async () => {
      findGamesSpy.mockRejectedValueOnce(new Error('test error'));

      const response = await supertest(app)
        .get('/games/games')
        .query({ gameType: 'Nim', status: 'WAITING_TO_START' });

      expect(response.status).toEqual(500);
      expect(response.text).toContain('Error when getting games: test error');
    });
  });
});

describe('playMove & socket handlers', () => {
  let httpServer: HTTPServer;
  let ioClient: FakeSOSocket;
  let clientSocket: ClientSocket;
  let serverSocket: ServerSocket;

  let mockNimGame: NimGame;
  let getGameSpy: jest.SpyInstance;
  let applyMoveSpy: jest.SpyInstance;
  let toModelSpy: jest.SpyInstance;
  let saveGameStateSpy: jest.SpyInstance;
  let removeGameSpy: jest.SpyInstance;

  beforeAll(done => {
    httpServer = createServer();
    ioClient = new Server(httpServer);
    gameController(ioClient);

    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      clientSocket = io(`http://localhost:${port}`);
      ioClient.on('connection', socket => {
        serverSocket = socket;
      });

      clientSocket.on('connect', done);
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockNimGame = new NimGame();
    mockNimGame.join('player1');
    mockNimGame.join('player2');

    getGameSpy = jest.spyOn(mockGameManager, 'getGame');
    applyMoveSpy = jest.spyOn(mockNimGame, 'applyMove');
    toModelSpy = jest.spyOn(mockNimGame, 'toModel').mockReturnValue({
      state: {
        moves: [],
        remainingObjects: 0,
        status: 'IN_PROGRESS',
      },
      gameID: '',
      players: [],
      gameType: 'Nim',
    });

    saveGameStateSpy = jest.spyOn(mockNimGame, 'saveGameState').mockResolvedValue(undefined);
    removeGameSpy = jest.spyOn(mockGameManager, 'removeGame');
  });

  afterAll(done => {
    clientSocket.removeAllListeners();
    clientSocket.disconnect();
    if (serverSocket) {
      serverSocket.removeAllListeners();
      serverSocket.disconnect();
    }
    ioClient.close();
    httpServer.close(() => done());
  });

  it('should join a game when "joinGame" event is emitted', async () => {
    const joinGameEvent = new Promise(resolve => {
      serverSocket.once('joinGame', arg => {
        expect(ioClient.sockets.adapter.rooms.has('game123')).toBeTruthy();
        resolve(arg);
      });
    });

    clientSocket.emit('joinGame', 'game123');

    const joinGameArg = await joinGameEvent;

    expect(joinGameArg).toBe('game123');
  });

  it('should leave a game when "leaveGame" event is emitted', async () => {
    const joinGameEvent = new Promise(resolve => {
      serverSocket.once('joinGame', arg => {
        expect(ioClient.sockets.adapter.rooms.has('game123')).toBeTruthy();
        resolve(arg);
      });
    });

    const leaveGameEvent = new Promise(resolve => {
      serverSocket.once('leaveGame', arg => {
        expect(ioClient.sockets.adapter.rooms.has('game123')).toBeFalsy();
        resolve(arg);
      });
    });

    clientSocket.emit('joinGame', 'game123');
    clientSocket.emit('leaveGame', 'game123');

    const [joinGameArg, leaveGameArg] = await Promise.all([joinGameEvent, leaveGameEvent]);

    expect(joinGameArg).toBe('game123');
    expect(leaveGameArg).toBe('game123');
  });

  it('should emit a "gameUpdate" event when a game exists and a valid move is made', async () => {
    getGameSpy.mockReturnValueOnce(mockNimGame);
    const gameMovePayload = {
      gameID: 'game123',
      move: {
        playerID: 'player1',
        gameID: 'game123',
        move: { numObjects: 2 },
      },
    };

    const joinGameEvent = new Promise(resolve => {
      serverSocket.once('joinGame', arg => {
        resolve(arg);
      });
    });

    const makeMoveEvent = new Promise(resolve => {
      serverSocket.once('makeMove', arg => {
        resolve(arg);
      });
    });

    const gameUpdateEvent = new Promise(resolve => {
      clientSocket.once('gameUpdate', (arg: unknown) => {
        resolve(arg);
      });
    });

    clientSocket.emit('joinGame', 'game123');
    clientSocket.emit('makeMove', gameMovePayload);

    const [joinMoveArg, makeMoveArg, gameUpdateArg] = await Promise.all([
      joinGameEvent,
      makeMoveEvent,
      gameUpdateEvent,
    ]);

    expect(joinMoveArg).toBe('game123');
    expect(makeMoveArg).toStrictEqual(gameMovePayload);
    expect(gameUpdateArg).toHaveProperty('gameInstance');
    expect(getGameSpy).toHaveBeenCalledWith('game123');
    expect(applyMoveSpy).toHaveBeenCalledWith({
      playerID: 'player1',
      gameID: 'game123',
      move: { numObjects: 2 },
    });
    expect(toModelSpy).toHaveBeenCalled();
    expect(saveGameStateSpy).toHaveBeenCalled();
    expect(removeGameSpy).not.toHaveBeenCalled();
  });

  it('should remove the game if the game ends after playing a move', async () => {
    getGameSpy.mockReturnValueOnce(mockNimGame);
    applyMoveSpy.mockImplementation(() => {
      mockNimGame.state.status = 'OVER';
    });
    const gameMovePayload = {
      gameID: 'game123',
      move: {
        playerID: 'player1',
        gameID: 'game123',
        move: { numObjects: 2 },
      },
    };

    const joinGameEvent = new Promise(resolve => {
      serverSocket.once('joinGame', arg => {
        resolve(arg);
      });
    });

    const makeMoveEvent = new Promise(resolve => {
      serverSocket.once('makeMove', arg => {
        resolve(arg);
      });
    });

    const gameUpdateEvent = new Promise(resolve => {
      clientSocket.once('gameUpdate', (arg: unknown) => {
        resolve(arg);
      });
    });

    clientSocket.emit('joinGame', 'game123');
    clientSocket.emit('makeMove', gameMovePayload);

    const [joinMoveArg, makeMoveArg, gameUpdateArg] = await Promise.all([
      joinGameEvent,
      makeMoveEvent,
      gameUpdateEvent,
    ]);

    expect(joinMoveArg).toBe('game123');
    expect(makeMoveArg).toStrictEqual(gameMovePayload);
    expect(gameUpdateArg).toHaveProperty('gameInstance');
    expect(getGameSpy).toHaveBeenCalledWith('game123');
    expect(applyMoveSpy).toHaveBeenCalledWith({
      playerID: 'player1',
      gameID: 'game123',
      move: { numObjects: 2 },
    });
    expect(toModelSpy).toHaveBeenCalled();
    expect(saveGameStateSpy).toHaveBeenCalled();
    expect(removeGameSpy).toHaveBeenCalledWith('game123');
  });

  it('should emit "gameError" event when a game does not exist', async () => {
    getGameSpy.mockReturnValue(undefined);
    const gameMovePayload = {
      gameID: 'game123',
      move: {
        playerID: 'player1',
        gameID: 'game123',
        move: { numObjects: 2 },
      },
    };

    const makeMoveEvent = new Promise(resolve => {
      serverSocket.once('makeMove', arg => {
        resolve(arg);
      });
    });

    const gameUpdateEvent = new Promise<void>((resolve, reject) => {
      clientSocket.once('gameUpdate', reject);
      resolve();
    });

    const gameErrorEvent = new Promise(resolve => {
      clientSocket.once('gameError', (arg: unknown) => {
        resolve(arg);
      });
    });

    clientSocket.emit('joinGame', 'game123');
    clientSocket.emit('makeMove', gameMovePayload);

    const [makeMoveArg, , gameErrorArg] = await Promise.all([
      makeMoveEvent,
      gameUpdateEvent,
      gameErrorEvent,
    ]);

    expect(makeMoveArg).toStrictEqual(gameMovePayload);
    expect(gameErrorArg).toStrictEqual({
      player: 'player1',
      error: 'Game requested does not exist',
    });
    expect(getGameSpy).toHaveBeenCalledWith('game123');
    expect(applyMoveSpy).not.toHaveBeenCalled();
    expect(toModelSpy).not.toHaveBeenCalled();
    expect(saveGameStateSpy).not.toHaveBeenCalled();
    expect(removeGameSpy).not.toHaveBeenCalled();
  });
});
