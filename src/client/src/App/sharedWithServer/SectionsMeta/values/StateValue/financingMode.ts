export const financingMode = ["purchase", "refinance"] as const;

export type FinancingMode = (typeof financingMode)[number];
