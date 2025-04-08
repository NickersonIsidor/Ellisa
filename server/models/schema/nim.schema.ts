import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Nim game state.
 *
 * This schema defines the structure of the game state specific to the Nim game. It includes the following fields:
 * - `moves`: An array of moves made by the players. Each move contains:
 *    - `numObjects`: The number of objects removed from the pile by the player.
 * - `player1`: The username of the first player.
 * - `player2`: The username of the second player.
 * - `winners`: An array of usernames of the players who won the game.
 * - `status`: The current game status, which can be one of the following values:
 *    - `'IN_PROGRESS'`: The game is ongoing.
 *    - `'WAITING_TO_START'`: The game is waiting to start.
 *    - `'OVER'`: The game is finished.
 * - `remainingObjects`: The number of remaining objects in the game.
 */
const nimGameStateSchema = new Schema({
  moves: [
    {
      numObjects: { type: Number, required: true },
    },
  ],
  player1: { type: String },
  player2: { type: String },
  winners: [{ type: String }],
  status: { type: String, enum: ['IN_PROGRESS', 'WAITING_TO_START', 'OVER'], required: true },
  remainingObjects: { type: Number },
});

const nimSchema = new Schema({
  state: { type: nimGameStateSchema, required: true },
});

export default nimSchema;
