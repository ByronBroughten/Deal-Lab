import { baseOptions, baseSection } from "./baseSection";
import { baseVarb } from "./baseVarb";
import { baseVarbs } from "./baseVarbs";

export const base = {
  varb: baseVarb,
  varbs: baseVarbs,
  options: baseOptions,
  section: baseSection,
} as const;
