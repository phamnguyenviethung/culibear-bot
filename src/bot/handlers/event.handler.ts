import logger from '@/configs/logger.config';
import { readdirSync } from 'fs';
import path from 'path';
import { BotClient } from '..';

export default async (client: BotClient) => {
  const basePath =
    process.env.NODE_ENV === 'production' ? path.resolve(process.cwd(), 'dist') : path.resolve(process.cwd(), 'src');
  const foldersPath = path.resolve(basePath, 'src/bot/events');

  let count = 0;
  const files = readdirSync(foldersPath);
  for (const f of files) {
    const ext = f.endsWith('.event.ts') ? '.event.ts' : f.endsWith('.event.js') ? '.event.js' : null;
    if (!ext) continue;
    const eventName = f.substring(0, f.indexOf(ext));
    const eventModule = await import(path.join(foldersPath, f));
    const event = eventModule.default;
    client.on(eventName, event.bind(null, client));
    count++;
  }
  logger.info(`${count} event đã sẵn sàng!`);
};
