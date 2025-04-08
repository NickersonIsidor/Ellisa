import { GameMove, NimGameState, NimMove } from '../../types/types';
import { MAX_NIM_OBJECTS } from '../../types/constants';
import Game from './game';

/**
 * Represents a game of Nim, extending the generic Game class.
 *
 * This class contains the specific game logic for playing Nim.
 */
class NimGame extends Game<NimGameState, NimMove> {
  /**
   * Constructor for the NimGame class, initializes the game state and type.
   */
  public constructor() {
    super(
      {
        status: 'WAITING_TO_START',
        moves: [],
        remainingObjects: MAX_NIM_OBJECTS,
      },
      'Nim',
    );
  }

  /**
   * Calculates the remaining objects in the game based on the moves made so far.
   * @param moves The list of moves made so far in the game.
   * @returns The number of remaining objects in the game.
   */
  private _remainingObjects(moves: readonly NimMove[]): number {
    return moves.reduce((acc, move) => acc - move.numObjects, MAX_NIM_OBJECTS);
  }

  /**
   * Validates the move based on the current game state, player, and move rules.
   * @param gameMove The move to validate, including the player ID and move details.
   * @throws Will throw an error if the move is invalid.
   */
  private _validateMove(gameMove: GameMove<NimMove>): void {
    const { playerID, move } = gameMove;

    // Ensure the correct player is making the move.
    if (
      (this.state.moves.length % 2 === 0 && playerID !== this.state.player1) ||
      (this.state.moves.length % 2 === 1 && playerID !== this.state.player2)
    ) {
      throw new Error('Invalid move: wrong player');
    }

    // Ensure the game is in progress.
    if (this.state.status !== 'IN_PROGRESS') {
      throw new Error('Invalid move: game is not in progress');
    }

    const remainingObjects = this._remainingObjects(this.state.moves);

    // Ensure the move is valid based on the number of objects to remove.
    if (move.numObjects < 1 || move.numObjects > 3) {
      throw new Error('Invalid move: must remove between 1 and 3 objects');
    }

    if (move.numObjects > remainingObjects) {
      throw new Error('Invalid move: cannot remove more objects than are left');
    }
  }

  /**
   * Checks if the game has ended based on the remaining objects.
   * If the game has ended, updates the game state to reflect the winner.
   */
  private _gameEndCheck(): void {
    if (this.state.remainingObjects === 0) {
      this.state = {
        ...this.state,
        status: 'OVER',
        winners: [this._players[this.state.moves.length % 2]],
      };
    }
  }

  /**
   * Applies a move to the game, validating it and updating the state.
   * @param move The move to apply.
   */
  public applyMove(move: GameMove<NimMove>): void {
    this._validateMove(move);

    const updatedMoves = [...this.state.moves, move.move];

    this.state = {
      ...this.state,
      moves: updatedMoves,
      remainingObjects: this._remainingObjects(updatedMoves),
    };

    this._gameEndCheck();
  }

  /**
   * Joins a player to the game. The game can only be joined if it is waiting to start.
   * @param playerID The ID of the player joining the game.
   * @throws Will throw an error if the player cannot join.
   */
  protected _join(playerID: string): void {
    if (this.state.status !== 'WAITING_TO_START') {
      throw new Error('Cannot join game: already started');
    }

    if (this._players.includes(playerID)) {
      throw new Error('Cannot join game: player already in game');
    }

    if (this.state.player1 === undefined) {
      this.state = { ...this.state, player1: playerID };
    } else if (this.state.player2 === undefined) {
      this.state = { ...this.state, player2: playerID };
    }

    if (this.state.player1 !== undefined && this.state.player2 !== undefined) {
      this.state = { ...this.state, status: 'IN_PROGRESS' };
    }
  }

  /**
   * Removes a player from the game. If a player leaves during an ongoing game, the game ends.
   * @param playerID The ID of the player leaving the game.
   * @throws Will throw an error if the player is not in the game.
   */
  protected _leave(playerID: string): void {
    if (!this._players.includes(playerID)) {
      throw new Error(`Cannot leave game: player ${playerID} is not in the game.`);
    }

    if (this.state.status === 'WAITING_TO_START' && this.state.player1 === playerID) {
      this.state = { ...this.state, player1: undefined };
    } else if (this.state.status === 'IN_PROGRESS') {
      if (this.state.player1 === playerID && this.state.player2 !== undefined) {
        this.state = {
          ...this.state,
          status: 'OVER',
          player1: undefined,
          winners: [this.state.player2],
        };
      } else if (this.state.player2 === playerID && this.state.player1 !== undefined) {
        this.state = {
          ...this.state,
          status: 'OVER',
          player2: undefined,
          winners: [this.state.player1],
        };
      }
    }
  }
}

export default NimGame;
