import { ObjectId } from 'mongodb';

/**
 * Represents a tag used for categorizing content.
 * - `name`: The name of the tag.
 * - `description`: A brief description of the tag's purpose or usage.
 */
export interface Tag {
  name: string;
  description: string;
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Represents a tag in the database with a unique identifier.
 * - `name`: The name of the tag.
 * - `description`: A brief description of the tag's purpose or usage.
 * - `_id`: The unique identifier for the tag.
 */
export interface DatabaseTag extends Tag {
  _id: ObjectId;
}
