import { nanoid } from "nanoid";
import { z } from "zod";
import { Str } from "../utils/Str";

type ID = string;
export const Id = {
  length: 12,
  get zodSchema() {
    return z.string().max(this.length).min(this.length);
  },
  is(value: any): value is ID {
    return typeof value === "string" && value.length === this.length;
  },
  validate(value: any): ID {
    const str = Str.validate(value);
    if (str.length !== this.length) {
      throw new Error(
        `Passed string "${str}" is not of the correct length to be an id`
      );
    }
    return str;
  },
  make() {
    return nanoid(this.length);
  },
} as const;
