import { isEqual } from "lodash";
import { ValidationError } from "./Error";

function lastIdx(arr: readonly any[]): number {
  return arr.length - 1;
}

function lastOrThrow<V extends any>(arr: readonly V[]): V {
  const idx = lastIdx(arr);
  if (idx < 0) {
    throw new Error("This array has no last value—it has no value.");
  } else return arr[idx];
}

export const Arr = {
  getOnlyOne<T extends any>(arr: T[], arrayOf?: string): T {
    const strArrayOf = arrayOf ?? "items";
    if (arr.length < 1) {
      throw new Error(`The array does not have any ${strArrayOf}`);
    } else if (arr.length > 1) {
      throw new Error(`The array has too many ${strArrayOf}`);
    } else {
      return arr[0];
    }
  },
  insert<V>(arr: readonly V[], value: V, idx: number): V[] {
    const nextArr = [...arr];
    nextArr.splice(idx, 0, value);
    return nextArr;
  },
  nextRotatingValue<T>(arr: readonly T[], currentValue: T): T {
    const currentIdx = arr.indexOf(currentValue as any);
    const nextIdx = (currentIdx + 1) % arr.length;
    return arr[nextIdx];
  },
  replaceAtIdxClone<V>(arr: readonly V[], value: V, idx: number): V[] {
    const nextArr = [...arr];
    nextArr[idx] = value;
    return nextArr;
  },
  unionOrArrToArr<T>(value: T | T[]): T[] {
    if (Array.isArray(value)) return value;
    else return [value];
  },
  rmFirstMatchMutate(arr: any[], value: any): void {
    const index = arr.indexOf(value);
    arr.splice(index, 1);
  },
  rmFirstMatchCloneOrThrow<T extends any>(arr: T[], value: T): T[] {
    const index = arr.indexOf(value);
    if (index < 0) {
      throw new Error(`No value in the array matches "${value}".`);
    }
    const nextArr = [...arr];
    nextArr.splice(index, 1);
    return nextArr;
  },
  replaceValueMutate(arr: any[], value: any, nextValue: any): void {
    while (true) {
      const index = arr.indexOf(value);
      if (index === -1) break;
      arr[index] = nextValue;
    }
  },
  replaceValueClone(arr: any[], value: any, nextValue: any): any[] {
    const nextArr = [...arr];
    while (true) {
      const index = arr.indexOf(value);
      if (index === -1) break;
      nextArr[index] = nextValue;
    }
    return nextArr;
  },
  upOneDimension<T extends any>(arr: T[], innerArrsLength: number): T[][] {
    return arr.reduce(
      (arrOfArrs, item) => {
        if (arrOfArrs.length > 0) {
          const lastRow = this.lastOrThrow(arrOfArrs);
          if (lastRow.length === innerArrsLength) arrOfArrs.push([item]);
          else lastRow.push(item);
        }
        return arrOfArrs;
      },
      [[]] as T[][]
    );
  },
  inverseIndex(idx: number, arrLength: number) {
    const lastIdx = arrLength - 1;
    return lastIdx - idx;
  },
  indicesOf(arr: any[], value: any): number[] {
    const indices: number[] = [];
    for (const idx in arr) {
      if (arr[idx] === value) indices.push(parseInt(idx));
    }
    return indices;
  },
  lastIdx(arr: readonly any[]): number {
    return arr.length - 1;
  },
  isLastIdx(arr: readonly any[], idx: number): boolean {
    return this.lastIdx(arr) === idx;
  },
  lastOrThrow,
  includes<T, U extends T>(arr: readonly U[], elem: T): elem is U {
    return arr.includes(elem as any);
  },
  numsInOffsetLength(offset: number, length: number) {
    return Array.from({ length }, (_, k) => k + offset);
  },
  rmLikeObjClone<T>(arr: T[], obj: T): T[] {
    return this.findAndRmClone(arr, (o) => isEqual(o, obj));
  },
  findAndRmClone<T>(arr: T[], fn: (value: T) => boolean): T[] {
    const nextArr = [...arr];
    this.findAndRmMutate(arr, fn);
    return nextArr;
  },
  findAndRmMutate<T>(arr: T[], fn: (value: T) => boolean) {
    const idx = arr.findIndex(fn);
    if (idx !== -1) arr.splice(idx, 1);
  },
  removeLastClone<T>(arr: T[]): T[] {
    const nextArr = [...arr];
    nextArr.pop();
    return nextArr;
  },
  findAll<T>(arr: readonly T[], fn: (value: T) => boolean): T[] {
    const arrClone = [...arr];
    const all: T[] = [];
    while (true) {
      const idx = arr.findIndex(fn);
      if (idx >= 0) {
        all.push(arr[idx]);
        arrClone.splice(idx, 1);
      } else {
        return all;
      }
    }
  },
  has<T>(arr: T[], fn: (value: T) => boolean): boolean {
    const value = arr.find(fn);
    if (value === undefined) return false;
    else return true;
  },
  findIn<T>(arr: T[], fn: (value: T) => boolean): T | undefined {
    const idx = arr.findIndex(fn);
    if (idx === -1) return undefined;
    else return arr[idx];
  },
  objIsIn<T>(obj: T, objArr: T[]): boolean {
    const match = objArr.find((o) => isEqual(o, obj));
    if (match) return true;
    else return false;
  },
  rmDuplicateObjsClone<T>(arr: T[]): T[] {
    return arr.reduce((nextArr, obj) => {
      if (!this.objIsIn(obj, nextArr)) nextArr.push(obj);
      return nextArr;
    }, [] as T[]);
  },
  tuple<T extends unknown[]>(...args: T): T {
    return args;
  },
  exclude<A extends any, B extends any>(
    a: readonly A[],
    b: readonly B[]
  ): Exclude<A, B>[] {
    return a.filter((str) => !b.includes(str as any)) as Exclude<A, B>[];
  },
  excludeStrict<A extends any, B extends A>(
    a: readonly A[],
    b: readonly B[]
  ): Exclude<A, B>[] {
    return a.filter((str) => !b.includes(str as any)) as Exclude<A, B>[];
  },
  extractStrict<A extends any, B extends A>(
    a: readonly A[],
    b: readonly B[]
  ): Extract<A, B>[] {
    return a.filter((str) => b.includes(str as any)) as Extract<A, B>[];
  },
  extractOrder<A extends any, B extends A>(
    a: readonly A[],
    b: readonly B[]
  ): Extract<A, B>[] {
    return b.filter((str) => a.includes(str as any)) as Extract<A, B>[];
  },
  extract<A extends any, B extends any>(
    a: readonly A[],
    b: readonly B[]
  ): Extract<A, B>[] {
    return a.filter((str) => b.includes(str as any)) as Extract<A, B>[];
  },
  removeAtIndexClone<T>(arr: readonly T[], idx: number): T[] {
    this.validateIdxOrThrow(arr, idx);
    const nextArr = [...arr];
    nextArr.splice(idx, 1);
    return nextArr;
  },
  idxOrThrow<T>(arr: readonly T[], finder: (val: T) => boolean): number {
    const idx = arr.findIndex(finder);
    if (idx < 0) {
      throw new ValueNotFoundError("Value not found at any index.");
    }
    return idx;
  },
  validateIdxOrThrow(arr: readonly any[], idx: number): true {
    const highestIdx = arr.length - 1;
    if (idx > highestIdx) {
      throw new Error(
        `The passed array does not have a value at passed idx ${idx}`
      );
    }
    return true;
  },
  combineWithoutIdenticals<A extends any, B extends any>(
    a: A[],
    b: B[]
  ): (A | B)[] {
    return [...new Set([...a, ...b])];
  },
  validateIsArray(value: any): any[] {
    if (!Array.isArray(value)) {
      throw new ValidationError("The received value is not an array.");
    } else return value;
  },
} as const;

export class ValueNotFoundError extends Error {}
