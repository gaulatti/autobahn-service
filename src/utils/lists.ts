import { start } from 'repl';

/**
 * Calculates pagination parameters based on the given offset and end row.
 *
 * @param offset - The starting point of the pagination.
 * @param endRow - The ending point of the pagination.
 * @returns An object containing the offset and the calculated limit.
 */
const getPaginationParams = (offset: number | string, endRow: number) => {
  if (!offset || !endRow) {
    return {};
  }

  if (typeof offset === 'string') {
    offset = parseInt(offset);
  }

  const limit: number = endRow - offset;

  return { offset, limit };
};

export { getPaginationParams };
