// import { isEqual, pick } from "lodash";
import { isArray, isEqual, isObject, pick, transform } from "lodash";
import { shallowEqualObjects } from "shallow-equal";
import { ValidationError } from "./Error";
import { PropKeysOfValue } from "./Obj/SubType";
import { entryKeysWithPropOfType } from "./Obj/entryKeysWithProp";
import { merge, spread } from "./Obj/merge";
import {
  NextObjEntries,
  ObjectKeys,
  ObjectValues,
  forSureEntries,
} from "./Obj/typedObject";
import { StrictPick, SubType } from "./types";

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

type UpdateObjProps<O extends any, K extends keyof O> = {
  obj: O;
  key: K;
  val: O[K];
};

type StringObj = { [key: string]: string };
type SwapKeysAndValues<O extends { [key: string]: string }> = {
  [K in keyof O as O[K]]: K;
};

function difference(origObj: any, newObj: any) {
  function changes(newObj: any, origObj: any) {
    let arrayIndexCounter = 0;
    return transform(newObj, function (result: any, value: any, key: string) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] =
          isObject(value) && isObject(origObj[key])
            ? changes(value, origObj[key])
            : value;
      }
    });
  }
  return changes(newObj, origObj);
}

export const Obj = {
  isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  },
  removeUndefined(obj: any) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
  },
  shallowEqual(a: any, b: any): boolean {
    return shallowEqualObjects(a, b);
  },
  isKey<O extends Record<string, any>>(obj: O, value: any): value is keyof O {
    return this.keys(obj).includes(value);
  },
  stringifyEqual(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
  },
  difference,
  swapKeysAndValues<O extends StringObj>(obj: O): SwapKeysAndValues<O> {
    return this.keys(obj).reduce((swapObj, key) => {
      swapObj[obj[key]] = key;
      return swapObj;
    }, {} as StringObj) as SwapKeysAndValues<O>;
  },
  updateIfPropExists<O, K extends keyof O>({
    obj,
    key,
    val,
  }: UpdateObjProps<O, K>): O {
    if (this.isObjToAny(obj) && key in (obj as any)) {
      obj[key] = val;
      return obj;
    } else
      throw new Error(`Prop "${String(key)}" is not in the passed object.`);
  },
  isObjToAny(value: any): value is any {
    if (value && typeof value === "object") return true;
    else return false;
  },
  isObjToRecord(value: any): value is Record<string, any> {
    if (value && typeof value === "object") return true;
    else return false;
  },
  validateObjToAny(value: any): any {
    if (this.isObjToAny(value)) return value;
    else {
      throw new ValidationError(`"${value}" is not an Object`);
    }
  },
  strictPick<O extends object, KS extends keyof O>(
    obj: O,
    keys: KS[]
  ): StrictPick<O, KS> {
    return pick(obj, keys);
  },
  noGuardIs: (value: any) =>
    typeof value === "object" && value !== null && !Array.isArray(value),
  keys: ObjectKeys,
  values: ObjectValues,
  entries: NextObjEntries,
  entriesFull: NextObjEntries,
  forSureEntries,
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
  propKeysOfValue<O extends object, V extends O[keyof O]>(
    obj: O,
    value: V
  ): PropKeysOfValue<O, V> {
    const keys = this.keys(obj).filter((key) => obj[key] === value);
    return keys as PropKeysOfValue<O, V>;
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
  entryKeysWithPropOfType,
  spread: spread,
  merge: merge,
} as const;
