import api from './config';
import { DatabaseMessage, Message } from '../types/types';

const MESSAGE_API_URL = `${process.env.REACT_APP_SERVER_URL}/messaging`;

/**
 * Interface extending the request body when adding a message, which contains:
 * - messageToAdd - The message being added.
 */
interface AddMessageRequestBody {
  messageToAdd: Omit<Message, 'type'>;
}

/**
 * Adds a new message to a specific chat with the given id.
 *
 * @param messageToAdd - The message object to add to the chat.
 * @throws an error if the request fails or the response status is not 200.
 */
const addMessage = async (messageToAdd: Omit<Message, 'type'>): Promise<DatabaseMessage> => {
  const reqBody: AddMessageRequestBody = {
    messageToAdd,
  };
  const res = await api.post(`${MESSAGE_API_URL}/addMessage`, reqBody);
  if (res.status !== 200) {
    throw new Error('Error while adding a new message to a chat');
  }
  return res.data;
};

/**
 * Function to fetch all messages in ascending order of their date and time.
 * @param user The user to fetch their chat for
 * @throws Error if there is an issue fetching the list of chats.
 */
const getMessages = async (): Promise<DatabaseMessage[]> => {
  const res = await api.get(`${MESSAGE_API_URL}/getMessages`);
  if (res.status !== 200) {
    throw new Error('Error when fetching list of chats for the given user');
  }
  return res.data;
};

export { addMessage, getMessages };
