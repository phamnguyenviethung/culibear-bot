import loginToBot from '@/bot/index.js';
import logger from '@/configs/logger.config.js';
import dotenv from 'dotenv';
import appConfig from '@/configs/app.config.js';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
});
logger.info(`env: ${appConfig.bot.env}`);

const start = async () => {
  try {
    await loginToBot(process.env.BOT_TOKEN as string, process.env.BOT_CLIENT_ID as string);
  } catch (error) {
    logger.error('Error while starting the bot', error);
    process.exit(1);
  }
};

start();
