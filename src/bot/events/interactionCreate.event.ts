import logger from '@/configs/logger.config';
import { AutocompleteInteraction, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { BotClient } from '..';
import cooldownService from '@/core/service/cooldown.service';

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
