export type ToArrObj<O extends object> = {
  [Prop in keyof O]: O[Prop][];
};
