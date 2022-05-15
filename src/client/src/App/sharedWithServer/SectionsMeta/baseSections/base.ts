import { baseOptions, baseSection } from "./baseSection";
import { baseVarbs } from "./baseVarbs";

export const base = {
  varbs: baseVarbs,
  options: baseOptions,
  section: baseSection,
} as const;
