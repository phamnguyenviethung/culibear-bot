import logger from '@/configs/logger.config.js';
import birthdayJob from './birhtday.job.js';

export default () => {
  birthdayJob();
  logger.info('Cron jobs started');
};
