import { CommandInteractionParams } from '@/bot/events/interactionCreate.event.js';
import discordMessageService from '@/core/service/discordMessage.service.js';
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Muốn bot gửi tin nhắn gì đó?')
    .addStringOption((option) => option.setName('content').setDescription('Nội dung tin nhắn').setRequired(true)),
  noDefer: true,
  cooldown: 1,
  async run({ interaction, client }: CommandInteractionParams) {
    const content = interaction.options.getString('content');
    if (!content) {
      return interaction.reply({ content: 'Vui lòng nhập nội dung', ephemeral: true });
    }
    await discordMessageService.sendToMainChannel(client, content);
    await interaction.reply({ content: 'Tin nhắn đã được gửi', ephemeral: true });
  }
};
