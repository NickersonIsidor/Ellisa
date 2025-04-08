import { nanoid } from 'nanoid';
import { GameInstance, GameInstanceID, GameMove, GameState, GameType } from '../../types/types';
import GameModel from '../../models/games.model';

/**
 * Abstract class representing a generic game.
 *
 * This class defines the basic structure and functionality for a game, including managing
 * players, game state, and saving the game state to the database. It is extended by specific
 * game types, which implement more specific logic.
 */
abstract class Game<StateType extends GameState, MoveType> {
  private _state: StateType;

  public readonly id: GameInstanceID;

  protected _players: string[] = [];

  protected _gameType: GameType;

  /**
   * Creates a new game instance with the provided initial state and game type.
   * @param initialState The initial state of the game.
   * @param gameType The type of the game.
   */
  public constructor(initialState: StateType, gameType: GameType) {
    this.id = nanoid() as GameInstanceID;
    this._state = initialState;
    this._gameType = gameType;
  }

  /**
   * Gets the current state of the game.
   * @returns The current state.
   */
  public get state() {
    return this._state;
  }

  /**
   * Sets a new state for the game.
   * @param newState The new state to set.
   */
  protected set state(newState: StateType) {
    this._state = newState;
  }

  /**
   * Gets the type of the game.
   * @returns The game type.
   */
  public get gameType() {
    return this._gameType;
  }

  /**
   * Abstract method to apply a move to the game state.
   * @param move The move to apply.
   */
  public abstract applyMove(move: GameMove<MoveType>): void;

  /**
   * Abstract method for handling a player joining the game.
   * @param playerID The player ID to join.
   */
  protected abstract _join(playerID: string): void;

  /**
   * Abstract method for handling a player leaving the game.
   * @param playerID The player ID to leave.
   */
  protected abstract _leave(playerID: string): void;

  /**
   * Adds a player to the game.
   * @param playerID The player ID to join the game.
   */
  public join(playerID: string): void {
    this._join(playerID);
    this._players.push(playerID);
  }

  /**
   * Removes a player from the game.
   * @param playerID The player ID to leave the game.
   */
  public leave(playerID: string): void {
    this._leave(playerID);
    this._players = this._players.filter(p => p !== playerID);
  }

  /**
   * Converts the game instance to a model that can be stored in the database.
   * @returns The game model representation.
   */
  public toModel(): GameInstance<StateType> {
    return {
      state: this._state,
      gameID: this.id,
      players: this._players,
      gameType: this._gameType,
    };
  }

  /**
   * Saves the current game state to the database.
   * @returns A promise indicating when the game state is saved.
   */
  public async saveGameState(): Promise<void> {
    await GameModel.findOneAndUpdate({ gameID: this.id }, this.toModel(), { upsert: true });
  }
}

export default Game;
