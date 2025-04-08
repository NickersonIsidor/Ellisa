import MessageModel from '../models/messages.model';
import UserModel from '../models/users.model';
import { DatabaseMessage, DatabaseUser, Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 * @param {Message} message - The message to save
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  try {
    const user: DatabaseUser | null = await UserModel.findOne({ username: message.msgFrom });

    if (!user) {
      throw new Error('Message sender is invalid or does not exist.');
    }

    const result: DatabaseMessage = await MessageModel.create(message);
    return result;
  } catch (error) {
    return { error: `Error when saving a message: ${(error as Error).message}` };
  }
};

/**
 * Retrieves all global messages from the database, sorted by date in ascending order.
 * @returns {Promise<DatabaseMessage[]>} - An array of messages or an empty array if error occurs.
 */
export const getMessages = async (): Promise<DatabaseMessage[]> => {
  try {
    const messages: DatabaseMessage[] = await MessageModel.find({ type: 'global' });
    messages.sort((a, b) => a.msgDateTime.getTime() - b.msgDateTime.getTime());

    return messages;
  } catch (error) {
    return [];
  }
};
