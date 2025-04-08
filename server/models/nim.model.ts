import { Model } from 'mongoose';
import { GameInstance, NimGameState } from '../types/types';
import GameModel from './games.model';
import nimSchema from './schema/nim.schema';

/**
 * Mongoose model for the `Nim` game, extending the `Game` model using a discriminator.
 *
 * This model adds specific fields from the `nimSchema` to the `Game` collection, enabling operations
 * specific to the `Nim` game type while sharing the same collection.
 */
const NimModel: Model<GameInstance<NimGameState>> = GameModel.discriminator('Nim', nimSchema);

export default NimModel;
