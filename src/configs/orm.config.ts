// Make sure to install the 'pg' package
import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';
import { Logger } from 'drizzle-orm';
import logger from './logger.config.js';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
});
class AppLogger implements Logger {
  logQuery(message: string): void {
    logger.info(message);
  }
}

const db = drizzle({
  logger: new AppLogger(),

  connection: {
    connectionString: process.env.DATABASE_URL as string
  }
});

export default db;
