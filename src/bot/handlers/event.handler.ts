import logger from '@/configs/logger.config.js';
import { readdirSync } from 'fs';
import path from 'path';
import { BotClient } from '../index.js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client: BotClient) => {
  const foldersPath = path.resolve(__dirname, '../events');
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
