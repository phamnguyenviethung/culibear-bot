import { CommandInteractionParams } from '@/bot/events/interactionCreate.event.js';
import birthdayService from '@/core/service/birthday.service.js';
import { bold, italic, SlashCommandBuilder } from 'discord.js';

const getBirthDayText = async () => {
  const birthdays = await birthdayService.getAllBirthdays();
  let text = '';
  for (const birthday of birthdays) {
    const name = bold(birthday.name ?? 'Unknown');
    if (birthday.isToday) {
      text += `- ${name} - ${birthday.strDate}(Hôm nay) 🎉🎉🎉🎉🎉🎉\n`;
    } else {
      text += `- ${name} - ${birthday.strDate} ${italic(`(${birthday.dayLeft} ngày)`)}\n`;
    }
  }
  return !text ? 'Không có sinh nhật nào' : text;
};

export default {
  data: new SlashCommandBuilder()
    .setName('sinhnhat')
    .setDescription('Đăng ký sinh nhật')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('ghinho')
        .setDescription('Ghi nhớ sinh nhật')
        .addStringOption((option) => option.setName('ngay').setDescription('Ngày sinh nhật').setRequired(true))
        .addStringOption((option) => option.setName('thang').setDescription('Tháng sinh nhật').setRequired(true))
        .addStringOption((option) => option.setName('nam').setDescription('Năm sinh nhật').setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand.setName('xoa').setDescription('Xóa sinh nhật'))
    .addSubcommand((subcommand) => subcommand.setName('danhsach').setDescription('Xem danh sách sinh nhật')),
  cooldown: 1,
  async run({ interaction }: CommandInteractionParams) {
    const subcommand = interaction.options.getSubcommand();
    if (!subcommand) {
      return interaction.followUp({ content: 'Vui lòng chọn subcommand', ephemeral: true });
    }

    const user = interaction.user;
    const day = interaction.options.getString('ngay');
    const month = interaction.options.getString('thang');
    const year = interaction.options.getString('nam');

    switch (subcommand) {
      case 'ghinho':
        {
          if (!day || !month || !year) {
            return interaction.followUp({ content: 'Vui lòng nhập đầy đủ thông tin', ephemeral: true });
          }
          const result = await birthdayService.addBirthday(user.id, day, month, year);
          if (result) {
            await interaction.followUp('Ghi nhớ sinh nhật thành công');
          } else {
            await interaction.followUp('Ghi nho sinh nhật thất bại');
          }
        }
        break;
      case 'xoa':
        {
          const result = await birthdayService.removeBirthday(user.id);
          if (result) {
            await interaction.followUp('Xóa sinh nhật thành công');
          } else {
            await interaction.followUp('Xóa sinh nhật thất bại');
          }
        }
        break;
      case 'danhsach':
        {
          const text = await getBirthDayText();
          await interaction.followUp({ content: text });
        }
        break;
      default:
        return interaction.followUp({ content: 'Subcommand không hợp lệ', ephemeral: true });
    }
  }
};
