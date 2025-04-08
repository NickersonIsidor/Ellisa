import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Game collection.
 *
 * This schema defines the structure of a game document in the database.
 * Each game includes the following fields:
 * - `gameID`: A unique identifier for the game.
 * - `players`: A list of usernames of the players involved in the game.
 * - `state`: The current state of the game, represented as an object.
 * - `gameType`: The type of the game (e.g., 'Nim').
 */
const gameSchema: Schema = new Schema(
  {
    gameID: {
      type: String,
      unique: true,
    },
    players: {
      type: [String],
      required: true,
    },
    state: {
      type: Object,
      required: true,
    },
    gameType: {
      type: String,
      enum: ['Nim'],
      required: true,
    },
  },
  { collection: 'Game' },
);

export default gameSchema;
