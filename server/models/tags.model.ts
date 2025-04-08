import mongoose, { Model } from 'mongoose';
import tagSchema from './schema/tag.schema';
import { DatabaseTag } from '../types/types';

/**
 * Mongoose model for the `Tag` collection.
 *
 * This model is created using the `Tag` interface and the `tagSchema`, representing the
 * `Tag` collection in the MongoDB database, and provides an interface for interacting with
 * the stored tags.
 *
 * @type {Model<DatabaseTag>}
 */
const TagModel: Model<DatabaseTag> = mongoose.model<DatabaseTag>('Tag', tagSchema);

export default TagModel;
