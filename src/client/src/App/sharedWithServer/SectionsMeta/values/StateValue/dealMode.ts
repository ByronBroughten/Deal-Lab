export const dealModes = [
  // homeBuyer
  "buyAndHold",
  "fixAndFlip",
  // brrrr
] as const;

export type DealMode = (typeof dealModes)[number];

export const dealModesPlusMixed = [...dealModes, "mixed"] as const;
export type DealModeOrMixed = (typeof dealModesPlusMixed)[number];
