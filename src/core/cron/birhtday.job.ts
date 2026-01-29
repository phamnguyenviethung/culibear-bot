import cron from 'node-cron';
import birthdayService from '../service/birthday.service.js';
import { cronOptions } from './cron.config.js';

export default () => {
  cron.schedule('0 */2 * * *', () => birthdayService.sendBirthdayMessageJob(), cronOptions);
  cron.schedule('0 6 * * *', () => birthdayService.remindBirthdayMessageJob(), cronOptions);
  cron.schedule('0 19 * * *', () => birthdayService.remindBirthdayMessageJob(), cronOptions);
};
