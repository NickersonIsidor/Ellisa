import {
  DatabaseComment,
  DatabaseMessage,
  DatabaseTag,
  DatabaseUser,
  MessageInChat,
  PopulatedDatabaseAnswer,
  PopulatedDatabaseChat,
  PopulatedDatabaseQuestion,
} from '../types/types';
import AnswerModel from '../models/answers.model';
import QuestionModel from '../models/questions.model';
import TagModel from '../models/tags.model';
import CommentModel from '../models/comments.model';
import ChatModel from '../models/chat.model';
import UserModel from '../models/users.model';
import MessageModel from '../models/messages.model';

/**
 * Fetches and populates a question document with its related tags, answers, and comments.
 *
 * @param {string} questionID - The ID of the question to fetch.
 * @returns {Promise<PopulatedDatabaseQuestion | null>} - The populated question document, or null if not found.
 */
const populateQuestion = async (questionID: string): Promise<PopulatedDatabaseQuestion | null> => {
  const result = await QuestionModel.findOne({ _id: questionID }).populate<{
    tags: DatabaseTag[];
    answers: PopulatedDatabaseAnswer[];
    comments: DatabaseComment[];
  }>([
    { path: 'tags', model: TagModel },
    {
      path: 'answers',
      model: AnswerModel,
      populate: { path: 'comments', model: CommentModel },
    },
    { path: 'comments', model: CommentModel },
  ]);

  return result;
};

/**
 * Fetches and populates an answer document with its related comments.
 *
 * @param {string} answerID - The ID of the answer to fetch.
 * @returns {Promise<PopulatedDatabaseAnswer | null>} - The populated answer document, or null if not found.
 */
const populateAnswer = async (answerID: string): Promise<PopulatedDatabaseAnswer | null> => {
  const result = await AnswerModel.findOne({ _id: answerID }).populate<{
    comments: DatabaseComment[];
  }>([{ path: 'comments', model: CommentModel }]);

  return result;
};

/**
 * Fetches and populates a chat document with its related messages and user details.
 *
 * @param {string} chatID - The ID of the chat to fetch.
 * @returns {Promise<Chat | null>} - The populated chat document, or an error if not found.
 * @throws {Error} - Throws an error if the chat document is not found.
 */
const populateChat = async (chatID: string): Promise<PopulatedDatabaseChat | null> => {
  const chatDoc = await ChatModel.findOne({ _id: chatID }).populate<{
    messages: DatabaseMessage[];
  }>([{ path: 'messages', model: MessageModel }]);

  if (!chatDoc) {
    throw new Error('Chat not found');
  }

  const messagesWithUser: Array<MessageInChat | null> = await Promise.all(
    chatDoc.messages.map(async (messageDoc: DatabaseMessage) => {
      if (!messageDoc) return null;

      let userDoc: DatabaseUser | null = null;

      if (messageDoc.msgFrom) {
        userDoc = await UserModel.findOne({ username: messageDoc.msgFrom });
      }

      return {
        _id: messageDoc._id,
        msg: messageDoc.msg,
        msgFrom: messageDoc.msgFrom,
        msgDateTime: messageDoc.msgDateTime,
        type: messageDoc.type,
        user: userDoc
          ? {
              _id: userDoc._id!,
              username: userDoc.username,
            }
          : null,
      };
    }),
  );

  // Filters out null values
  const enrichedMessages = messagesWithUser.filter(Boolean);
  const transformedChat: PopulatedDatabaseChat = {
    ...chatDoc.toObject(),
    messages: enrichedMessages as MessageInChat[],
  };

  return transformedChat;
};

/**
 * Fetches and populates a question, answer, or chat document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the document to fetch.
 * @param {'question' | 'answer' | 'chat'} type - Specifies the type of document to fetch.
 * @returns {Promise<QuestionResponse | AnswerResponse | ChatResponse>} - A promise resolving to the populated document or an error message if the operation fails.
 */
// eslint-disable is for testing purposes only, so that Jest spy functions can be used.
// eslint-disable-next-line import/prefer-default-export
export const populateDocument = async (
  id: string,
  type: 'question' | 'answer' | 'chat',
): Promise<
  PopulatedDatabaseAnswer | PopulatedDatabaseChat | PopulatedDatabaseQuestion | { error: string }
> => {
  try {
    if (!id) {
      throw new Error('Provided ID is undefined.');
    }

    let result = null;

    switch (type) {
      case 'question':
        result = await populateQuestion(id);
        break;
      case 'answer':
        result = await populateAnswer(id);
        break;
      case 'chat':
        result = await populateChat(id);
        break;
      default:
        throw new Error('Invalid type provided.');
    }

    if (!result) {
      throw new Error(`Failed to fetch and populate ${type} with ID: ${id}`);
    }

    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};
