import { isEqual } from "lodash";
import { merge } from "./Obj/merge";
import { Full, SubType } from "./typescript";

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
export function ObjectEntries<O extends object, T extends Full<O>>(
  obj: O
): Entries<T>[] {
  return Object.entries(obj) as any;
}

type Keys<T> = [keyof T];
export function ObjectKeys<O extends object, T extends Full<O>>(
  obj: O
): Keys<T> {
  return Object.keys(obj) as any;
}

type Values<T> = [T[keyof T]];
export function ObjectValues<T extends object>(t: T): Values<T> {
  return Object.values(t) as any;
}

export const isObjNotArr = (value: any): value is { [key: string]: any } => {
  return !!(value && !Array.isArray(value) && typeof value === "object");
};

export const getFirstVal = (obj: object) => {
  return Object.values(obj)[0];
};
export const getFirstKey = (obj: object) => {
  return Object.keys(obj)[0];
};
export const findEntryByValue = (obj: object, value: any) => {
  return Object.entries(obj).filter(
    (pair: [string, string]) => pair[1] === value
  )[0];
};

export const queryWithDotString = (obj: any, dotString: string) => {
  return dotString.split(".").reduce((o: any, i) => o[i], obj);
};

export function extend<A extends object = {}, B extends object = {}>(
  a?: A,
  b?: B
): A & B {
  return { ...a, ...b } as A & B;
}

export const Obj = {
  keys: ObjectKeys,
  values: ObjectValues,
  entries: ObjectEntries,
  filterKeysForEntryShape<O extends object, M extends any>(
    obj: O,
    model: M
  ): (keyof SubType<O, M>)[] {
    return ObjectKeys(obj).filter((prop) => {
      return isEqual(obj[prop], model);
    }) as (keyof SubType<O, M>)[];
  },
  toNestedPropertyObj<
    O extends {
      [key: string]: {
        [key: string]: any;
      };
    },
    P extends keyof Required<O>[keyof Required<O>]
  >(obj: O, propName: P) {
    return ObjectKeys(obj).reduce((propObj, key) => {
      propObj[key] = obj[key][propName] as O[typeof key][P];
      return propObj;
    }, {} as { [Prop in keyof O]: O[Prop][P] });
  },
  entryKeysWithProp<
    O extends object,
    P extends string,
    R extends (keyof SubType<O, { [Prop in P]: any }>)[]
  >(obj: O, propName: P): R {
    return this.keys(obj).filter((key) => propName in obj[key]) as R;
  },
  entryKeysWithPropValue<
    O extends { [key: string]: any },
    P extends string,
    V extends any
  >(obj: O, propName: P, value: V): (keyof SubType<O, { [Prop in P]: V }>)[] {
    return this.keys(obj).filter(
      (key) => propName in obj[key] && obj[key][propName] === value
    ) as (keyof SubType<O, { [Prop in P]: V }>)[];
  },
  merge: merge,
} as const;
