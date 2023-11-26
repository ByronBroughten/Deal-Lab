export const piCalculationNames = [
  "interestOnlySimple",
  "piFixedStandard",
] as const;
export type PiCalculationName = (typeof piCalculationNames)[number];
