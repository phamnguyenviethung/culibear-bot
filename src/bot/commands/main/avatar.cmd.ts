import { CommandInteractionParams } from '@/bot/events/interactionCreate.event';
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Xem avatar của bạn hoặc người khác')
    .addUserOption((option) => option.setName('user').setDescription('Người dùng cần xem avatar').setRequired(false)),
  cooldown: 2,
  noDefer: true,
  async run({ interaction }: CommandInteractionParams) {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatar = user.displayAvatarURL({ size: 1024, extension: 'png' });

    return interaction.reply({ content: `<@${user.id}>`, files: [{ attachment: avatar }] });
  }
};
