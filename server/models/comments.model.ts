import mongoose, { Model } from 'mongoose';
import commentSchema from './schema/comment.schema';
import { DatabaseComment } from '../types/types';

/**
 * Mongoose model for the `Comment` collection.
 *
 * This model is created using the `Comment` interface and the `commentSchema`, representing the
 * `Comment` collection in the MongoDB database, and provides an interface for interacting with
 * the stored comments.
 *
 * @type {Model<DatabaseComment>}
 */
const CommentModel: Model<DatabaseComment> = mongoose.model<DatabaseComment>(
  'Comment',
  commentSchema,
);

export default CommentModel;
