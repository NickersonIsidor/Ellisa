import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { DatabaseMessage, Message } from './message';
import { DatabaseUser } from './user';

/**
 * Extends the raw Message with an extra `user` field for
 * populated user details (populated from `msgFrom`).
 * - `user`: populated user details, including `_id` and `username`, or `null` if no user is found.
 */
export interface MessageInChat extends DatabaseMessage {
  user: Pick<DatabaseUser, '_id' | 'username'> | null;
}

/**
 * Represents a Chat with participants and messages (unpopulated).
 * - `participants`: Array of usernames representing the chat participants.
 * - `messages`: Array of `Message` objects.
 */
export interface Chat {
  participants: string[];
  messages: Message[];
}

/**
 * Represents a Chat stored in the database.
 * - `_id`: Unique identifier for the chat.
 * - `participants`: Array of user ObjectIds representing the chat participants.
 * - `messages`: Array of ObjectIds referencing messages in the chat.
 * - `createdAt`: Timestamp for when the chat was created (set by Mongoose).
 * - `updatedAt`: Timestamp for when the chat was last updated (set by Mongoose).
 */
export interface DatabaseChat extends Omit<Chat, 'messages'> {
  _id: ObjectId;
  messages: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a fully populated Chat from the database.
 * - `messages`: Array of `MessageInChat` objects, each populated with user details.
 */
export interface PopulatedDatabaseChat extends Omit<DatabaseChat, 'messages'> {
  messages: MessageInChat[];
}

/**
 * Express request for creating a chat.
 * - `body`: The chat object to be created, including participants and messages.
 */
export interface CreateChatRequest extends Request {
  body: {
    participants: string[];
    messages: Omit<Message, 'type'>[];
  };
}

/**
 * Custom request type for routes that require a `chatId` in the params.
 * - `params`: Contains the `chatId` of the chat to be accessed.
 */
export interface ChatIdRequest extends Request {
  params: {
    chatId: string;
  };
}

/**
 * Express request for adding a message to a chat.
 * - `body`: The message object to be added, excluding the `type` field.
 * - `chatId` is passed in the route params.
 */
export interface AddMessageRequestToChat extends ChatIdRequest {
  body: Omit<Message, 'type'>;
}

/**
 * Express request for adding a participant to a chat.
 * - `body`: Contains the `username` of the participant to be added.
 * - `chatId` is passed in the route params.
 */
export interface AddParticipantRequest extends ChatIdRequest {
  body: {
    username: string;
  };
}

/**
 * Express request for fetching a chat based on the participants' username.
 * - `params`: Contains the `username` of the participant to look up the chat.
 */
export interface GetChatByParticipantsRequest extends Request {
  params: {
    username: string;
  };
}

/**
 * A type representing the possible responses for a Chat operation.
 * - Either a `DatabaseChat` object or an error message.
 */
export type ChatResponse = DatabaseChat | { error: string };
