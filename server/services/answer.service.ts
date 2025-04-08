import {
  Answer,
  AnswerResponse,
  DatabaseAnswer,
  DatabaseQuestion,
  PopulatedDatabaseAnswer,
  PopulatedDatabaseQuestion,
  QuestionResponse,
} from '../types/types';
import AnswerModel from '../models/answers.model';
import QuestionModel from '../models/questions.model';

/**
 * Records the most recent answer time for a given question based on its answers.
 *
 * @param {PopulatedDatabaseQuestion} question - The question containing answers to check.
 * @param {Map<string, Date>} mp - A map storing the most recent answer time for each question.
 */
export const getMostRecentAnswerTime = (
  question: PopulatedDatabaseQuestion,
  mp: Map<string, Date>,
): void => {
  question.answers.forEach((answer: PopulatedDatabaseAnswer) => {
    const currentMostRecent = mp.get(question._id.toString());
    if (!currentMostRecent || currentMostRecent < answer.ansDateTime) {
      mp.set(question._id.toString(), answer.ansDateTime);
    }
  });
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} answer - The answer object to be saved.
 * @returns {Promise<AnswerResponse>} - A promise resolving to the saved answer or an error message.
 */
export const saveAnswer = async (answer: Answer): Promise<AnswerResponse> => {
  try {
    const result: DatabaseAnswer = await AnswerModel.create(answer);
    return result;
  } catch (error) {
    return { error: 'Error when saving an answer' };
  }
};

/**
 * Adds an existing answer to a specified question in the database.
 *
 * @param {string} qid - The ID of the question to which the answer will be added.
 * @param {DatabaseAnswer} ans - The answer to associate with the question.
 * @returns {Promise<QuestionResponse>} - A promise resolving to the updated question or an error message.
 */
export const addAnswerToQuestion = async (
  qid: string,
  ans: DatabaseAnswer,
): Promise<QuestionResponse> => {
  try {
    if (!ans || !ans.text || !ans.ansBy || !ans.ansDateTime) {
      throw new Error('Invalid answer');
    }

    const result: DatabaseQuestion | null = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );

    if (result === null) {
      throw new Error('Error when adding answer to question');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};
