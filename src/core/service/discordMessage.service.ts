import { BotClient } from '@/bot/index.js';
import logger from '@/configs/logger.config.js';
import { Client, TextChannel } from 'discord.js';
export interface IDiscordMessageService {
  sendMessageToUser(client: Client, userId: string, content: string): Promise<void>;
}

class DiscordMessageService implements IDiscordMessageService {
  async sendMessageToUser(client: BotClient, userId: string, content: string): Promise<void> {
    const user = await client.users.fetch(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    try {
      await user.send(content);
      logger.info(`Message sent to user ${userId}: ${content}`);
    } catch (error) {
      logger.error(`Failed to send message to user ${userId}:`, error);
    }
  }

  async sendMessageToChannel(client: BotClient, channelId: string, content: string): Promise<boolean> {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      logger.error(`Channel with ID ${channelId} not found`);
      return false;
    }
    try {
      await (channel as TextChannel).send(content);
      logger.info(`Message sent to channel ${channelId}: ${content}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send message to channel ${channelId}:`, error);
      return false;
    }
  }

  async sendToMainChannel(client: BotClient, content: string): Promise<boolean> {
    return await this.sendMessageToChannel(client, process.env.MAIN_CHANNEL_ID as string, content);
  }
}

export default new DiscordMessageService();
