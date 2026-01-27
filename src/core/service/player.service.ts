import logger from '@/configs/logger.config.js';
import db from '@/configs/orm.config.js';
import { asc, eq, isNotNull } from 'drizzle-orm';
import { player, SelectPlayer } from '../db/schema/player.js';
import BirthdayDetailResponse from '../dto/response/BirthdayListResponse.dto.js';
import vietnamTime, { isToday } from '../helpers/time.js';
import discordMessageService from './discordMessage.service.js';
import { client } from '@/main.js';
import { userMention } from 'discord.js';
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

  async addBirthday(discordID: string, day: string, month: string, year: string): Promise<boolean> {
    const birthday = vietnamTime(`${year}-${month}-${day}`).toDate();
    const today = new Date();
    if (birthday > today || birthday < new Date(1940, 0, 1)) {
      return false;
    }

    const result = await db.update(player).set({ dob: birthday }).where(eq(player.id, discordID)).returning();
    if (result.length === 0) {
      return false;
    }

    logger.info(`Added birthday: ${discordID} - ${day}/${month}/${year}`);
    return true;
  }

  async removeBirthday(discordID: string): Promise<boolean> {
    const result = await db.update(player).set({ dob: null }).where(eq(player.id, discordID)).returning();
    return result.length > 0;
  }

  async getAllBirthdays(): Promise<BirthdayDetailResponse[]> {
    const result = await db.select().from(player).where(isNotNull(player.dob)).orderBy(asc(player.dob));

    logger.info(`Found ${result.length} birthdays`);

    return result.map((player: SelectPlayer) => {
      const today = vietnamTime();
      const dob = vietnamTime(player.dob ?? new Date());
      let nextBirthday = dob.year(today.year());
      if (nextBirthday.isBefore(today, 'day')) {
        nextBirthday = nextBirthday.year(today.year() + 1);
      }
      const dayLeftToBirthday = nextBirthday.diff(today, 'day');
      return {
        playerID: player.id,
        name: player.name,
        date: player.dob,
        strDate: player.dob ? vietnamTime(player.dob).format('DD/MM/YYYY') : null,
        isToday: player.dob ? isToday(player.dob) : false,
        dayLeft: dayLeftToBirthday
      };
    });
  }

  async sendBirthdayMessageJob(): Promise<void> {
    const birthdays = await this.getAllBirthdays();
    const todayBirthdays = birthdays.filter((birthday) => birthday.isToday);
    if (todayBirthdays.length > 0) {
      const msgPromise = todayBirthdays.map(async (birthday) => {
        const msg = `@here Hôm nay là sinh nhật của ${userMention(birthday.playerID)}`;

        return discordMessageService.sendToMainChannel(client, msg);
      });
      await Promise.all(msgPromise);
    } else {
      logger.info('No birthdays today');
    }
  }

  async remindBirthdayMessageJob(): Promise<void> {
    const birthdays = await this.getAllBirthdays();
    const nonTodayBirthdays = birthdays.filter((birthday) => !birthday.isToday);
    const upcomingBirthdays = nonTodayBirthdays.filter((birthday) => birthday.dayLeft <= 60);

    if (upcomingBirthdays.length > 0) {
      const lines = upcomingBirthdays.map(
        (birthday) => `- ${userMention(birthday.playerID)}: còn ${birthday.dayLeft} ngày (${birthday.strDate})`
      );
      const msg = `📅 **Sinh nhật sắp tới gần nhất:**\n${lines.join('\n')}`;

      await discordMessageService.sendToMainChannel(client, msg);
      logger.info(`Reminded ${upcomingBirthdays.length} upcoming birthdays`);
    } else if (nonTodayBirthdays.length > 0) {
      const closest = nonTodayBirthdays.reduce((min, b) => (b.dayLeft < min.dayLeft ? b : min));
      const msg = `📅 Sinh nhật của ${userMention(closest.playerID)} - còn ${closest.dayLeft} ngày (${closest.strDate})`;

      await discordMessageService.sendToMainChannel(client, msg);
      logger.info(`Reminded closest birthday: ${closest.playerID}`);
    } else {
      logger.info('No upcoming birthdays found');
    }
  }
}

export default new PlayerService();
