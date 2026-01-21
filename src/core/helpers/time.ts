import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';
dayjs.extend(utc);
dayjs.extend(timezone);

const vietnamTime = (t?: string | number | Date) => dayjs(t).locale('vi').tz('Asia/Ho_Chi_Minh');

export default vietnamTime;
