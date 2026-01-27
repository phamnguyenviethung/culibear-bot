import logger from '@/configs/logger.config.js';
import { BotClient } from '../index.js';
import appConfig from '@/configs/app.config.js';
import discordMessageService from '@/core/service/discordMessage.service.js';

export default async (client: BotClient) => {
  logger.info(client.user?.username + ' đã sẵn sàng');
  if (appConfig.bot.env === 'production' && process.env.LOG_CHANNEL_ID) {
    const msg = `@here ${client.user?.username} đã sẵn sàng`;
    await discordMessageService.sendMessageToChannel(client, process.env.LOG_CHANNEL_ID as string, msg);
  }
};
