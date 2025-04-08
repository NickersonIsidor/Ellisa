/**
 * Parses tags from a search string. Tags are assumed to be enclosed in square brackets (e.g., "[tag1][tag2]").
 *
 * @param {string} search - A search string containing tags wrapped in square brackets.
 *
 * @returns {string[]} - An array of tags found in the search string. Each tag is a string without the square brackets.
 */
export const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing any tags (enclosed in square brackets) and returning individual words.
 *
 * @param {string} search - The search string that may contain both keywords and tags.
 *
 * @returns {string[]} - An array of keywords found in the search string, with tags removed. Each keyword is a word.
 */
export const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];
