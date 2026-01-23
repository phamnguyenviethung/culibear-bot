import { CommandInteractionParams } from '@/bot/events/interactionCreate.event';
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Xem avatar của bạn hoặc người khác')
    .addUserOption((option) => option.setName('user').setDescription('Người dùng cần xem avatar').setRequired(false)),
  cooldown: 2,
  noDefer: true,
  async run({ interaction, client }: CommandInteractionParams) {
    const user = interaction.options.getUser('user') || interaction.user;

    let avatar = '';
    const guild = client.guilds.cache.get(interaction.guildId as string);
    if (guild) {
      const member = await guild.members.fetch(user.id);
      if (member) {
        avatar = member.displayAvatarURL({ size: 1024, extension: 'png' });
      } else {
        avatar = user.displayAvatarURL({ size: 1024, extension: 'png' });
      }
    }

    return interaction.reply({ content: `<@${user.id}>`, files: [{ attachment: avatar }] });
  }
};
