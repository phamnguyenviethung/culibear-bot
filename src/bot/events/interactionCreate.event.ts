import logger from '@/configs/logger.config.js';
import { AutocompleteInteraction, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { BotClient } from '../index.js';
import cooldownService from '@/core/service/cooldown.service.js';
import playerService from '@/core/service/player.service.js';

export interface CommandInteractionParams {
  client: BotClient;
  interaction: ChatInputCommandInteraction;
}

export default async (client: BotClient, interaction: CommandInteraction | AutocompleteInteraction) => {
  if (interaction.isChatInputCommand()) {
    const cmdName = interaction.commandName;
    try {
      const command = client.interactions.get(cmdName);
      if (!command) return interaction.reply('Lệnh không hợp lệ');

      await playerService.createPlayer(interaction.user.id, interaction.user.username);

      if (!command.noDefer) await interaction.deferReply();

      const isValidCooldown = await cooldownService.checkCooldown({
        client,
        command,
        interaction
      });

      if (!isValidCooldown) return;

      const data: CommandInteractionParams = {
        client,
        interaction
      };
      await command.run(data);
    } catch (error) {
      logger.error('IC:', error);

      return interaction.followUp(`**${cmdName}**: có lỗi xảy ra`);
    }
  }
};
