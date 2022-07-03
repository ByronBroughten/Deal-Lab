import { SubType } from "../types";

export type PropKeysOfValue<
  O extends object,
  V extends O[keyof O]
> = (keyof SubType<O, V>)[];

export type PropKeyOfValue<
  O extends object,
  V extends O[keyof O]
> = keyof SubType<O, V>;
