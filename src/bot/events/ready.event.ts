import logger from '@/configs/logger.config.js';
import { BotClient } from '../index.js';

export default async (client: BotClient) => {
  logger.info(client.user?.username + ' đã sẵn sàng');
};
