import logger from '@/configs/logger.config';
import { BotClient } from '..';

module.exports = async (client: BotClient) => {
  logger.info(client.user?.username + ' đã sẵn sàng');
};
