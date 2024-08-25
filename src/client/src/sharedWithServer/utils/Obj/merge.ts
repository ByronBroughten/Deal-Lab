type OptionalPropertyNames<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = {
  [P in K]: L[P] | Exclude<R[P], undefined>;
};

type IdS<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

export type Merge<L, R> = IdS<
  Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

export type Spread<A extends readonly [...any]> = A extends [
  infer L,
  ...infer R
]
  ? Merge<L, Spread<R>>
  : unknown;

type Test1 = Spread<[{ a: string }, { a?: number }]>;

type Test21 = {
  a: 1;
  b: 2;
};
type Test22 = {
  a: 2;
  b: 2;
  c: 3;
};
type Test2 = Spread<[Test21, Test22]>;

type Test23 = {
  a: 3;
  d: 4;
};
type Test3 = Spread<[Test2, Test23]>;

export function spread<A extends object[]>(...a: [...A]) {
  return Object.assign({}, ...a) as Spread<A>;
}
export function merge<A extends object, B extends object>(a: A, b: B) {
  return { ...a, ...b } as any as Merge<A, B>;
}
