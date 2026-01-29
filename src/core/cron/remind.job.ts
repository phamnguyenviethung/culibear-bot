import cron from 'node-cron';
import remindService from '../service/remind.service.js';
import { cronOptions } from './cron.config.js';

export default () => {
  cron.schedule('0 0 * * *', () => remindService.remindSleepingMessageJob(), cronOptions);
};
