import { SubType } from "../types";
import { ObjectKeys } from "./typedObject";

type BasicTypes = {
  string: string;
  boolean: boolean;
  number: number;
  undefined: undefined;
  null: null;
};

export type EntryKeysWithPropOfType<
  O extends { [key: string]: any },
  P extends string,
  T extends keyof BasicTypes
> = (keyof SubType<O, { [Prop in P]: BasicTypes[T] }>)[];

export function entryKeysWithPropOfType<
  O extends { [key: string]: any },
  P extends string,
  T extends keyof BasicTypes
>(obj: O, propName: P, valueType: T): EntryKeysWithPropOfType<O, P, T> {
  return ObjectKeys(obj).filter(
    (key) => typeof obj[key][propName] === valueType
  ) as EntryKeysWithPropOfType<O, P, T>;
}
