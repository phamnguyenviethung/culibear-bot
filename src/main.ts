import loginToBot, { BotClient } from '@/bot/index.js';
import logger from '@/configs/logger.config.js';
import dotenv from 'dotenv';
import appConfig from '@/configs/app.config.js';
import registerCronJob from '@/core/cron/index.js';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
});
logger.info(`env: ${appConfig.bot.env}`);

export let client: BotClient;

const start = async () => {
  try {
    client = await loginToBot(process.env.BOT_TOKEN as string, process.env.BOT_CLIENT_ID as string);
    registerCronJob();
  } catch (error) {
    logger.error('Error while starting the bot', error);
    process.exit(1);
  }
};

start();
