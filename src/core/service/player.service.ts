import logger from '@/configs/logger.config.js';
import db from '@/configs/orm.config.js';
import { player } from '../db/schema/player.js';
class PlayerService {
  async createPlayer(discordID: string, name: string): Promise<boolean> {
    const result = await db
      .insert(player)
      .values({ id: discordID, name: name })
      .onConflictDoUpdate({
        target: [player.id],
        set: {
          name: name
        }
      });
    logger.info(`Player profile synced: ${discordID} - ${name}`);
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export default new PlayerService();
