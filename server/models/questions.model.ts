// Question Document Schema
import mongoose, { Model } from 'mongoose';
import questionSchema from './schema/question.schema';
import { DatabaseQuestion } from '../types/types';

/**
 * Mongoose model for the `Question` collection.
 *
 * This model is created using the `Question` interface and the `questionSchema`, representing the
 * `Question` collection in the MongoDB database, and provides an interface for interacting with
 * the stored questions.
 *
 * @type {Model<DatabaseQuestion>}
 */
const QuestionModel: Model<DatabaseQuestion> = mongoose.model<DatabaseQuestion>(
  'Question',
  questionSchema,
);

export default QuestionModel;
