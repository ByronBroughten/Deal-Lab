import { Full } from "../types";

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
export function ObjectEntries<O extends object, T extends Full<O>>(
  obj: O
): Entries<T>[] {
  return Object.entries(obj) as any;
}
export function forSureEntries<O extends object>(obj: O): Entries<O> {
  return Object.entries(obj) as any;
}

type NextEntries<O extends object> = { [K in keyof O]: [K, O[K]] }[keyof O][];
export function NextObjEntries<O extends object>(obj: O): NextEntries<Full<O>> {
  return Object.entries(obj) as any;
}
type Keys<T> = [keyof T];
export function ObjectKeys<O extends object>(obj: O): Keys<O> {
  return Object.keys(obj) as any;
}
export function NextObjKeys<O extends object>(obj: O): Keys<Full<O>> {
  return Object.keys(obj) as any;
}

type Values<T> = [T[keyof T]];
export function ObjectValues<T extends object>(t: T): Values<Full<T>> {
  return Object.values(t) as any;
}
export function NextObjValues<T extends object>(t: T): Values<T> {
  return Object.values(t) as any;
}
