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

const getSortParams = (sort: string) => {
  const order = [];

  if (!!sort && sort.length) {
    sort.split(';').forEach((s) => {
      const splittedSort = s.split(',');
      const sortField = splittedSort[0];
      const sortDirection = splittedSort[1].toUpperCase();

      /**
       * If the sort field is nested, we need to split
       * it and add it to the order array.
       */
      const field = sortField.includes('.')
        ? sortField.split('.')
        : [sortField];

      /**
       * This is a special case. TriggeredBy in the frontend includes
       * either the Project (if the Pulse was triggered by a Schedule)
       * or the User (if the Pulse was triggered manually).
       *
       * We must handle that case by sorting by both fields.
       */
      if (sortField.includes('triggeredBy')) {
        order.push(['triggeredBy', 'user', 'sub', sortDirection]);
        order.push(['target', 'name', sortDirection]);
      } else {
        order.push([...field, sortDirection]);
      }
    });
  }

  return order;
};

export { getPaginationParams, getSortParams };
