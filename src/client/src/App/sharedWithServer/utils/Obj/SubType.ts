import { SubType } from "../types";

export type PropKeysOfValue<
  O extends object,
  V extends O[keyof O]
> = keyof SubType<O, V>;
