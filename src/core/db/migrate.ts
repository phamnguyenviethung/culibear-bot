import { migrate } from 'drizzle-orm/node-postgres/migrator';
import db from '@/configs/orm.config.js';
import logger from '@/configs/logger.config.js';

/**
 * Run database migrations
 */
async function runMigrations() {
  try {
    logger.info('Running database migrations...');

    await migrate(db, {
      migrationsFolder: './drizzle'
    });

    logger.info('Migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

// Run migrations
runMigrations()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
