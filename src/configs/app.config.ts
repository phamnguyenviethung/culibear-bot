export default {
  bot: {
    env: process.env.NODE_ENV ?? 'development',
    mainBotToken: process.env.BOT_TOKEN,
    mainBotClientId: process.env.BOT_CLIENT_ID
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'dhbot'
  }
};
