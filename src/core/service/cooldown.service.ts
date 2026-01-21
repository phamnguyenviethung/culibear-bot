import { BotClient } from '@/bot';
import appConfig from '@/configs/app.config';
import { Collection, CommandInteraction } from 'discord.js';

class CooldownService {
  async checkCooldown({
    client,
    command,
    interaction
  }: {
    client: BotClient;
    command: any;
    interaction: CommandInteraction;
  }) {
    if (appConfig.bot.env === 'development') {
      return true;
    }

    if (!client.cooldowns.has(command.data.name)) {
      client.cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.data.name);

    // Get dynamic cooldown if getCooldown function exists, otherwise use default
    let cooldownSeconds = command.cooldown || 10;
    if (typeof command.getCooldown === 'function') {
      try {
        cooldownSeconds = await command.getCooldown(interaction.user.id);
      } catch (error) {
        console.warn(`Error getting dynamic cooldown for ${command.data.name}:`, error);
        cooldownSeconds = command.cooldown || 10; // fallback to default
      }
    }

    const cooldownAmount = cooldownSeconds * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const replyText = `Vui lòng chờ để sử dụng. Bạn có thể quay lại sau **${timeLeft.toFixed(0)} giây**`;
        if (!command.noDefer) {
          interaction.followUp(replyText);
        } else {
          interaction.reply(replyText);
        }

        return false;
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    return true;
  }

  resetCooldown({
    client,
    command,
    interaction
  }: {
    client: BotClient;
    command: any;
    interaction: CommandInteraction;
  }) {
    client.cooldowns.get(command.data.name).delete(interaction.user.id);
  }
}

export default new CooldownService();
