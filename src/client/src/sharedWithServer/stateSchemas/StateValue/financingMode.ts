export const financingModes = ["purchase", "refinance"] as const;

export type FinancingMode = (typeof financingModes)[number];
