export type ValueOf<T> = T[keyof T];

export type DropFirst<T extends unknown[]> = T extends [any, ...infer U]
  ? U
  : never;

type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
export type SubType<Base, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;

type StrictFilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition
    ? Condition extends Base[Key]
      ? Key
      : never
    : never;
};
type StrictAllowedNames<Base, Condition> = StrictFilterFlags<
  Base,
  Condition
>[keyof Base];
export type StrictSubType<Base, Condition> = Pick<
  Base,
  StrictAllowedNames<Base, Condition>
>;

export type Extends<T, U extends T> = U;

export type Full<O extends object> = {
  [K in keyof O]-?: O[K];
};

//
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
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
