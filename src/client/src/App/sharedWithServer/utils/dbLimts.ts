import { Id } from "../SectionsMeta/IdS";

export const dbLimits = {
  number: {
    max: 999999999999,
    get min() {
      return -this.max;
    },
  },
  stringOneLine: {
    maxLength: 255,
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
