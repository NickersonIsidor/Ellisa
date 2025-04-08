import { PopulatedDatabaseQuestion } from '../types/types';
import { getMostRecentAnswerTime } from '../services/answer.service';

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {PopulatedDatabaseQuestion[]} qlist - The list of questions to sort
 *
 * @returns {PopulatedDatabaseQuestion[]} - The sorted list of questions by ask date, newest first
 */
export const sortQuestionsByNewest = (
  qlist: PopulatedDatabaseQuestion[],
): PopulatedDatabaseQuestion[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });

/**
 * Filters and sorts a list of questions to return only unanswered questions, sorted by the asking date in descending order.
 *
 * @param {PopulatedDatabaseQuestion[]} qlist - The list of questions to filter and sort
 *
 * @returns {PopulatedDatabaseQuestion[]} - The filtered list of unanswered questions, sorted by ask date, newest first
 */
export const sortQuestionsByUnanswered = (
  qlist: PopulatedDatabaseQuestion[],
): PopulatedDatabaseQuestion[] => sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Filters and sorts a list of questions to return active questions, sorted by the most recent answer date in descending order.
 * Active questions are those with recent answers.
 *
 * @param {PopulatedDatabaseQuestion[]} qlist - The list of questions to filter and sort
 *
 * @returns {PopulatedDatabaseQuestion[]} - The filtered list of active questions, sorted by recent answer date and ask date
 */
export const sortQuestionsByActive = (
  qlist: PopulatedDatabaseQuestion[],
): PopulatedDatabaseQuestion[] => {
  const mp = new Map();

  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id.toString());
    const bdate = mp.get(b._id.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts a list of questions by the number of views in descending order. If two questions have the same number of views,
 * the newer question will appear first.
 *
 * @param {PopulatedDatabaseQuestion[]} qlist - The array of questions to be sorted
 *
 * @returns {PopulatedDatabaseQuestion[]} - A new array of questions sorted by the number of views, then by creation date
 */
export const sortQuestionsByMostViews = (
  qlist: PopulatedDatabaseQuestion[],
): PopulatedDatabaseQuestion[] =>
  sortQuestionsByNewest(qlist).sort((a, b) => b.views.length - a.views.length);
