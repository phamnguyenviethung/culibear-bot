import cron from 'node-cron';
import playerService from '../service/player.service.js';
import { cronOptions } from './cron.config.js';

export default () => {
  cron.schedule('0 */2 * * *', () => playerService.sendBirthdayMessageJob(), cronOptions);
  cron.schedule('0 6 * * *', () => playerService.remindBirthdayMessageJob(), cronOptions); // 6h sáng VN
  cron.schedule('0 19 * * *', () => playerService.remindBirthdayMessageJob(), cronOptions); // 7h tối VN
};
