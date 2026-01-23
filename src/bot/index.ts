import { Client, Collection, GatewayIntentBits, Partials, TextChannel } from 'discord.js';
import runEventHandler from './handlers/event.handler';
import runCommandHandler from './handlers/command.handler';
import logger from '@/configs/logger.config';

export interface BotClient extends Client {
  commands: Collection<string, any>;
  interactions: Collection<string, any>;
  cooldowns: Collection<string, any>;
}

export default async (token: string, clientID: string) => {
  const client: BotClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildPresences
    ],
    partials: [Partials.Message, Partials.User, Partials.Channel, Partials.GuildMember]
  }) as BotClient;

  client.commands = new Collection();
  client.interactions = new Collection();
  client.cooldowns = new Collection();
  runEventHandler(client);
  runCommandHandler(client, token, clientID);
  await client.login(token);
  const channels = await client.channels.fetch(process.env.MAIN_CHANNEL_ID as string);
  if (channels?.isTextBased()) {
    const c = channels as TextChannel;
    logger.info(`Main channel: #${c.name} in ${c.guild.name}`);
  }
  return client;
};
