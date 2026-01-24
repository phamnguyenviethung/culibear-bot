import logger from '@/configs/logger.config';
import { readdirSync } from 'fs';
import path from 'path';
import { BotClient } from '..';

export default async (client: BotClient) => {
  const foldersPath = path.resolve(__dirname, '../events');
  console.log('Folder path: ', foldersPath);

  let count = 0;
  const files = readdirSync(foldersPath);
  console.log('event files: ', files);
  for (const f of files) {
    const ext = f.endsWith('.event.ts') ? '.event.ts' : f.endsWith('.event.js') ? '.event.js' : null;
    if (!ext) continue;
    const eventName = f.substring(0, f.indexOf(ext));
    console.log('eventName: ', eventName);
    const eventModule = await import(path.join(foldersPath, f));
    const event = eventModule.default;
    client.on(eventName, event.bind(null, client));
    count++;
  }
  logger.info(`${count} event đã sẵn sàng!`);
};
