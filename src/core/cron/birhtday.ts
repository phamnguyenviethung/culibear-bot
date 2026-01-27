import cron from 'node-cron';
import playerService from '../service/player.service.js';

export default () => {
  cron.schedule('0 */2 * * *', () => playerService.sendBirthdayMessageJob());
  cron.schedule('0 23 * * *', () => playerService.remindBirthdayMessageJob()); // 6h sáng VN
  cron.schedule('0 12 * * *', () => playerService.remindBirthdayMessageJob()); // 7h tối VN
};
