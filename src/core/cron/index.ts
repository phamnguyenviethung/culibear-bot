import logger from '@/configs/logger.config.js';
import birthdayJob from './birhtday.job.js';
import remindJob from './remind.job.js';

export default () => {
  birthdayJob();
  remindJob();
  logger.info('Cron jobs started');
};
