type StringArrRecord = Record<string | "all", readonly string[]>;
export class StringTypeChecker<A extends StringArrRecord> {
  constructor(readonly arrs: A) {}
  is<T extends keyof A = "all">(value: any, type?: T): value is A[T][number] {
    return this.arrs[(type ?? "all") as T].includes(value);
  }
  validate<T extends keyof A = "all">(
    value: any,
    type?: T
  ): value is A[T][number] {
    if (!this.is(value, type)) {
      throw new Error(
        `value "${value}" is not of type "${
          ((type ?? String(type)) as string) || "all"
        }"`
      );
    } else return true;
  }
}
