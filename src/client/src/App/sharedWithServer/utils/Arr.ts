import { isEqual } from "lodash";

export const Arr = {
  rmFirstValueMutate(arr: any[], value: any): void {
    const index = arr.indexOf(value);
    arr.splice(index, 1);
  },
  rmFirstValueClone<T extends any>(arr: T[], value: T): T[] {
    const index = arr.indexOf(value);
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
        const lastRow = this.lastVal(arrOfArrs);
        if (lastRow.length === innerArrsLength) arrOfArrs.push([item]);
        else lastRow.push(item);
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
  lastIdx(arr: any[]) {
    return arr.length - 1;
  },
  lastVal(arr: any[]) {
    return arr[this.lastIdx(arr)];
  },
  includes<T, U extends T>(arr: readonly U[], elem: T): elem is U {
    return arr.includes(elem as any);
  },
  numsInOffsetLength(offset: number, length: number) {
    return Array.from({ length }, (_, k) => k + offset);
  },
  rmLikeObjClone<T>(arr: T[], obj: T): T[] {
    return this.findAndRmClone(arr, (o) => isEqual(o, obj));
  },
  findAndRmClone<T>(arr: T[], findValue: (value: T) => boolean): T[] {
    const nextArr = [...arr];
    const idx = nextArr.findIndex(findValue);
    if (idx !== -1) nextArr.splice(idx, 1);
    return nextArr;
  },
  findAndRaplace<T>(
    arr: T[],
    findValue: (value: T) => boolean,
    replacement: T
  ): T[] {
    const nextArr = [...arr];
    const idx = nextArr.findIndex(findValue);
    if (idx !== -1) nextArr[idx] = replacement;
    return nextArr;
  },
  removeLastClone<T>(arr: T[]): T[] {
    const nextArr = [...arr];
    nextArr.pop();
    return nextArr;
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
  extract<A extends any, B extends any>(
    a: readonly A[],
    b: readonly B[]
  ): Extract<A, B>[] {
    return a.filter((str) => b.includes(str as any)) as Extract<A, B>[];
  },
  combineWithoutIdenticals<A extends any, B extends any>(
    a: A[],
    b: B[]
  ): (A | B)[] {
    return [...new Set([...a, ...b])];
  },
};

export default Arr;
