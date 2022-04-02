export type ToArrObj<O extends object> = {
  [Prop in keyof O]: O[Prop][];
};

export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;
