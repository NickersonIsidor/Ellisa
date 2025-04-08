import mongoose, { Model } from 'mongoose';
import userSchema from './schema/user.schema';
import { DatabaseUser } from '../types/types';

/**
 * Mongoose model for the `User` collection.
 *
 * This model is created using the `User` interface and the `userSchema`, representing the
 * `User` collection in the MongoDB database, and provides an interface for interacting with
 * the stored users.
 *
 * @type {Model<DatabaseUser>}
 */
const UserModel: Model<DatabaseUser> = mongoose.model<DatabaseUser>('User', userSchema);

export default UserModel;
