export const timeS = {
  timestampToLegible(timestampMils: number) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
    }).format(timestampMils);
  },
  millisecondsToSeconds(mils: number): number {
    // seconds is standard
    return Math.floor(mils / 1000);
  },
  currentYear() {
    return new Date().getFullYear();
  },
  now() {
    return Date.now();
  },
  nowInSeconds() {
    return this.millisecondsToSeconds(this.now());
  },
  secondsToMilliSeconds(standard: number): number {
    return standard * 1000;
  },
  get oneDay(): number {
    return this.secondsToMilliSeconds(86400);
  },
  get thirtyDays(): number {
    return this.oneDay * 30;
  },
  get hundredsOfYearsFromNow() {
    return 11661201881000;
  },
  async delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  },
  isTimestamp(value: any): value is number {
    return typeof value === "number";
  },
  makeDateTimeFirstLastSaved(): DateTimeSavedProps {
    const now = this.now();
    return {
      dateTimeFirstSaved: now,
      dateTimeLastSaved: now,
    };
  },
} as const;

type DateTimeSavedProps = {
  dateTimeFirstSaved: number;
  dateTimeLastSaved: number;
};
