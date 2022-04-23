import { nanoid } from "nanoid";
import { z } from "zod";

type ID = string;
export const Id = {
  length: 12,
  get zodSchema() {
    return z.string().max(this.length).min(this.length);
  },
  is(value: any): value is ID {
    return this.zodSchema.safeParse(value).success;
  },
  make() {
    return nanoid(this.length);
  },
} as const;
