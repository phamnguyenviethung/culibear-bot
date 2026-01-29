import logger from '@/configs/logger.config.js';
import db from '@/configs/orm.config.js';
import { client } from '@/main.js';
import { userMention } from 'discord.js';
import { player } from '../db/schema/player.js';
import discordMessageService from './discordMessage.service.js';

class RemindService {
  async remindSleepingMessageJob(): Promise<void> {
    const players = await db.select().from(player);

    if (players.length === 0) {
      logger.info('No players found for sleep reminder');
      return;
    }

    const guild = client.guilds.cache.first();
    if (!guild) {
      logger.error('No guild found');
      return;
    }

    const onlinePlayerIds: string[] = [];

    logger.info(`Found ${players.length} players for sleep reminder`);

    for (const p of players) {
      try {
        const member = await guild.members.fetch(p.id);
        if (member && member.presence?.status && member.presence.status !== 'offline') {
          onlinePlayerIds.push(p.id);
        }
      } catch {
        // Member not found in guild, skip
        logger.error(`Player ${p.id} not found in guild`);
      }
    }

    if (onlinePlayerIds.length === 0) {
      logger.info('No online players found for sleep reminder');
      return;
    }

    const mentions = onlinePlayerIds.map((id) => userMention(id)).join(' ');
    const msg = `🌙 Đã qua ngày mới rồi nè! Nhắc nhở các bạn đi ngủ thôi~\n\n${mentions}\n\nChúc ngủ ngon! 💤`;

    await discordMessageService.sendToMainChannel(client, msg);
    logger.info(`Sent sleep reminder to ${onlinePlayerIds.length} online players`);
  }
}

export default new RemindService();
