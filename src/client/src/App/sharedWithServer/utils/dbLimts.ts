import { Id } from "../SectionsMeta/id";

export const dbLimits = {
  number: {
    max: 999999999999,
    get min() {
      return -this.max;
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
