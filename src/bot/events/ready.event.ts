import logger from '@/configs/logger.config';
import { BotClient } from '..';

export default async (client: BotClient) => {
  logger.info(client.user?.username + ' đã sẵn sàng');
};
