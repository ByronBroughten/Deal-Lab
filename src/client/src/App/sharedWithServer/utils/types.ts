import { Merge, Spread } from "./Obj/merge";

type HasStrings<K extends keyof any> = Record<K, string>;
export type HasSomethingAnd<
  K extends keyof any,
  O extends { [key: string]: any }
> = O & HasStrings<Exclude<K, keyof O>>;

export type ValueOf<T> = T[keyof T];

type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
export type SubType<Base, Condition> = PrettifyObj<
  Pick<Base, AllowedNames<Base, Condition>>
>;
type SubTypeTest = SubType<
  {
    a: 1;
    b: 2;
    c: "three";
  },
  number
>;

export type Extends<T, U extends T> = U;
export type PrettifyObj<O extends object> = Merge<O, {}>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Full<O extends object> = {
  [K in keyof O]-?: O[K];
};

export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never;
export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

//
export type NeversToNull<O extends object> = {
  [Prop in keyof O]: O[Prop] extends never ? null : O[Prop];
};
export type RemoveNotStrings<O extends object> = SubType<
  NeversToNull<O>,
  string
>;

export type NeversToSomething<O extends object, S extends any> = {
  [Prop in keyof O]: O[Prop] extends never ? S : O[Prop];
};

export type KeysFromUnion<T> = T extends { [key: string]: any }
  ? keyof T
  : never;
export type NotUn<
  T extends any = any,
  D extends any = any
> = T extends undefined ? D : T;
export type Specify<A extends object, B extends Partial<A>> = Merge<A, B>;

export type UnionToCombo<U extends any> = Spread<[UnionToIntersection<U>]>;

export type ToArrObj<O extends object> = {
  [Prop in keyof O]: O[Prop][];
};

// Borrowed from SimplyTyped:
// Borrowed from pelotom/hkts:
export type GetLength<original extends readonly any[]> = original extends {
  length: infer L;
}
  ? L
  : never;
export type GetLast<original extends readonly any[]> = original[Prev<
  GetLength<original>
>];
// Test
const test = ["a", "b", "c"] as const;
type TestLength = GetLength<typeof test>; // => 3
type TestLast = GetLast<typeof test>;
type Prev<T extends number> = [
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62
][T];
