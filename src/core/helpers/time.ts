import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import 'dayjs/locale/vi.js';
dayjs.extend(utc);
dayjs.extend(timezone);

const vietnamTime = (t?: string | number | Date) => dayjs(t).locale('vi').tz('Asia/Ho_Chi_Minh');

export const isToday = (d: Date) => {
  return vietnamTime(d).isSame(vietnamTime(), 'day');
};

export default vietnamTime;
