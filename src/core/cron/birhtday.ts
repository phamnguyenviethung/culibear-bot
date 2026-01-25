import cron from 'node-cron';
import playerService from '../service/player.service.js';

export default () => {
  cron.schedule('0 */2 * * *', () => playerService.sendBirthdayMessageJob());
};
