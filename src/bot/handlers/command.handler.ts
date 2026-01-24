import logger from '@/configs/logger.config';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { BotClient } from '..';

export default async (client: BotClient, token: string, clientID: string) => {
  const foldersPath = path.resolve(__dirname, '../commands');

  const commandsArray: any = [];
  let count = 0;
  let lockedCmd = 0;

  for (const dir of readdirSync(foldersPath)) {
    const commandFiles = readdirSync(`${foldersPath}/${dir}`).filter(
      (file) => file.endsWith('.cmd.ts') || file.endsWith('.cmd.js')
    );
    for (const file of commandFiles) {
      const filePath = path.join(foldersPath, dir, file);
      const commandModule = await import(filePath);
      const pull = commandModule.default;
      if (pull.data?.name && !pull.isLocked) {
        client.interactions.set(pull.data.name, pull);
        commandsArray.push(pull.data.toJSON());
        count++;
      } else {
        lockedCmd++;
      }
    }
  }
  const rest = new REST().setToken(token);
  client.on('ready', async () => {
    try {
      await rest.put(Routes.applicationCommands(clientID), {
        body: commandsArray
      });
      logger.info(`${client.user?.username}: ${count} lệnh đã sẵn sàng`);

      if (lockedCmd > 0) {
        logger.info(`${client.user?.username}: ${lockedCmd} lệnh đã bị vô hiệu hóa`);
      }
    } catch (error) {
      logger.error(`${client.user?.username}: Đăng ký lệnh thất bại:`, error);
    }
  });
};
