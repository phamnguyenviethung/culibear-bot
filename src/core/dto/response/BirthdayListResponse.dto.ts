export default interface BirthdayDetailResponse {
  playerID: string;
  name: string | null;
  date: Date | null;
  strDate: string | null;
  isToday: boolean;
  dayLeft: number;
}
