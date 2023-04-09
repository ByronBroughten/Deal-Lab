export const timeS = {
  millisecondsToSeconds(mils: number): number {
    // seconds is standard
    return Math.floor(mils / 1000);
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
