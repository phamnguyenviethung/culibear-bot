import logger from '@/configs/logger.config';
import { Client } from 'discord.js';
export interface IDiscordMessageService {
  sendMessageToUser(client: Client, userId: string, content: string): Promise<void>;
}

class DiscordMessageService implements IDiscordMessageService {
  async sendMessageToUser(client: Client, userId: string, content: string): Promise<void> {
    const user = await client.users.fetch(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    try {
      await user.send(content);
      logger.info(`Message sent to user ${userId}: ${content}`);
    } catch (error) {
      logger.error(`Failed to send message to user ${userId}:`, error);
      //   throw new Error(`Could not send message to user ${userId}: ${(error as Error).message}`);
    }
  }
}

export default new DiscordMessageService();
