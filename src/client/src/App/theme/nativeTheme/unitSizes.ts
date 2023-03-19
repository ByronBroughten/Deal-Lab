const spacings = {
  s0: "0.0625rem",
  s1: "0.125rem",
  s15: "0.1875rem",
  s2: "0.25rem",
  s25: "0.375rem",
  s3: "0.5rem",
  s35: "0.75rem",
  s4: "1rem",
  s45: "1.5rem",
  s5: "2rem",
  s6: "4rem",
  s7: "8rem",
} as const;

const fontSizes = {
  fs14: 14,
  fs16: 16,
  fs18: 18,
  fs20: 20,
  fs22: 22,
  fs24: 24,
  fs26: 26,
} as const;

const borderRadiuses = {
  br0: 5,
} as const;

const muiBr = {
  muiBr0: "5px",
} as const;

export const unitSizes = {
  ...fontSizes,
  ...spacings,
  ...borderRadiuses,
  ...muiBr,
} as const;
