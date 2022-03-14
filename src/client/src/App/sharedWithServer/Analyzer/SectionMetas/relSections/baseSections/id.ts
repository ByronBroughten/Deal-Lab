import { nanoid } from "nanoid";

export const Id = {
  length: 12,
  make() {
    return nanoid(this.length);
  },
};
