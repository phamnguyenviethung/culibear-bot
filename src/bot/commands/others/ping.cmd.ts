import { CommandInteractionParams } from '@/bot/events/interactionCreate.event.js';
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('Kiểm tra độ trễ'),
  async run({ client, interaction }: CommandInteractionParams) {
    await interaction.followUp(
      `🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  }
};
