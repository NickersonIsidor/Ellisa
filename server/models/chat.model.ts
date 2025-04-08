import mongoose, { Model } from 'mongoose';
import chatSchema from './schema/chat.schema';
import { DatabaseChat } from '../types/types';

/**
 * Mongoose model for the Chat collection.
 */
const ChatModel: Model<DatabaseChat> = mongoose.model<DatabaseChat>('Chat', chatSchema);

export default ChatModel;
