import { CronJob } from 'cron';

/**
 * Calculates the next execution time based on the given cron expression and current execution time.
 * If the cron expression is invalid or no next execution time is found, the current execution time is returned.
 *
 * @param cronExpression - The cron expression to calculate the next execution time.
 * @param currentExecutionTime - The current execution time.
 * @returns The next execution time or the current execution time if no next execution time is found.
 */
const getNextExecution = (
  cronExpression: string,
  currentExecutionTime: Date,
): Date => {
  let nextExecution: Date | undefined;

  const job = new CronJob(cronExpression, () => {}, undefined, false);
  const nextDate = job.nextDates(1).shift();

  if (nextDate) {
    nextExecution = nextDate.toJSDate();
  }

  return nextExecution || currentExecutionTime;
};

export { getNextExecution };
