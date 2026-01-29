import { Message } from 'discord.js';
import { BotClient } from '../index.js';

export const handleMentionBotMessage = async (client: BotClient, message: Message): Promise<void> => {
  const isMentionedBot = message.mentions.users.has(client.user?.id ?? '');
  if (isMentionedBot) {
    await message.react('❤️');
  }
};
