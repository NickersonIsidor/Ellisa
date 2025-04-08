import mongoose, { Model } from 'mongoose';
import messageSchema from './schema/message.schema';
import { DatabaseMessage } from '../types/types';

/**
 * Mongoose model for the `Message` collection.
 *
 * This model is created using the `Message` interface and the `messageSchema`, representing the
 * `Message` collection in the MongoDB database, and provides an interface for interacting with
 * the stored messages.
 *
 * @type {Model<DatabaseMessage>}
 */
const MessageModel: Model<DatabaseMessage> = mongoose.model<DatabaseMessage>(
  'Message',
  messageSchema,
);

export default MessageModel;
