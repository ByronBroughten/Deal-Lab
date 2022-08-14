export function getStandardNow() {
  return Math.floor(Date.now() / 1000);
}

export const timeS = {
  now() {
    return getStandardNow();
  },
  oneDay: 86400,
  get thirtyDays(): number {
    return this.oneDay * 30;
  },
  get hundredsOfYearsFromNow() {
    return this.now() + 10000000000;
  },
} as const;
