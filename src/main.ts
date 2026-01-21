import loginToBot from '@/bot';
import logger from '@/configs/logger.config';
import dotenv from 'dotenv';
import appConfig from './configs/app.config';

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
