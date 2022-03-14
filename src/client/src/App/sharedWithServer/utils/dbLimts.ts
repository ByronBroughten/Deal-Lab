import { Id } from "../Analyzer/SectionMetas/relSections/baseSections/id";

export const dbLimits = {
  number: {
    max: 99999999999,
    get min() {
      return this.max;
    },
  },
  string: {
    maxLength: 255,
  },
  password: {
    minLength: 8,
    get maxLength() {
      return dbLimits.string.maxLength;
    },
  },
  dbId: {
    length: Id.length,
  },
} as const;
