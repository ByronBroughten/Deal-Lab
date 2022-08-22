export const timeS = {
  millisecondsToStandard(mils: number): number {
    // seconds is standard
    return Math.floor(mils / 1000);
  },
  now() {
    return this.millisecondsToStandard(Date.now());
  },
  oneDay: 86400,
  get thirtyDays(): number {
    return this.oneDay * 30;
  },
  get hundredsOfYearsFromNow() {
    return 11661201881;
  },
} as const;
