import { IdS } from "./IdS";

export const dbLimits = {
  number: {
    max: 99999999999999999999,
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
    length: IdS.length,
  },
} as const;
