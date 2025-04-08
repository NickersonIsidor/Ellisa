import mongoose, { Model } from 'mongoose';
import gameSchema from './schema/games.schema';
import { GameInstance, GameState } from '../types/types';

/**
 * Mongoose model for the `Game` collection.
 *
 * This model is created using the `gameSchema`, representing the `Game` collection in the MongoDB database,
 * and provides an interface for interacting with the stored game data.
 */
const GameModel: Model<GameInstance<GameState>> = mongoose.model<GameInstance<GameState>>(
  'Game',
  gameSchema,
);

export default GameModel;
