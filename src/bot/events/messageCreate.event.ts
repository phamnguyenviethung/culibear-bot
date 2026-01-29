import { Message } from 'discord.js';
import { BotClient } from '../index.js';
import { handleMentionBotMessage } from '../messages/index.js';

export default async (client: BotClient, message: Message) => {
  if (message.author.bot) return;

  await handleMentionBotMessage(client, message);
};
