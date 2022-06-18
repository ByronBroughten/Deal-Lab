import { z } from "zod";
import { numObjUnits } from "../../StateSolvers/SolveValueVarb/solveText";
import { reqMonNumber, reqMonString } from "../../utils/mongoose";
import {
  DbNumObj,
  isDbNumObj,
  mDbNumObj,
  NumObj,
  NumObjCore,
  zDbNumObj,
} from "./baseValues/NumObj";
import { numObjUpdateFnNames } from "./baseValues/updateFnNames";
import { ValueName } from "./baseVarb";

export const valueMeta = {
  number: {
    is: (v: any): v is number => typeof v === "number",
    get isRaw() {
      return this.is;
    },
    rawToState: (v: number) => v,
    stateToRaw: (v: number) => v,
    updateFnNames: ["number"],
    dbInitValue: 0,
    defaultInit: () => 0,
    zod: z.number(),
    dbZod: z.number(),
    mon: reqMonNumber,
  },
  boolean: {
    is: (v: any): v is boolean => typeof v === "boolean",
    get isRaw() {
      return this.is;
    },
    rawToState: (v: boolean) => v,
    stateToRaw: (v: boolean) => v,
    updateFnNames: ["boolean"],
    dbInitValue: true,
    defaultInit: () => true,
    zod: z.boolean(),
    dbZod: z.boolean(),
    mon: { type: Boolean, required: true },
  },
  string: {
    is: (v: any): v is string => typeof v === "string",
    rawToState: (v: string) => v,
    stateToRaw: (v: string) => v,
    get isRaw() {
      return this.is;
    },
    updateFnNames: ["string", "loadedString"],
    dbInitValue: "",
    defaultInit: () => "",
    zod: z.string(),
    dbZod: z.string(),
    mon: reqMonString,
  },
  stringArray: {
    is: (v: any): v is string[] =>
      Array.isArray(v) && v.every((i: any) => typeof i === "string"),
    get isRaw() {
      return this.is;
    },
    rawToState: (v: string[]) => v,
    stateToRaw: (v: string[]) => v,
    updateFnNames: ["stringArray"],
    dbInitValue: [] as string[],
    defaultInit: () => [] as string[],
    zod: z.array(z.string()),
    dbZod: z.array(z.string()),
    mon: [reqMonString],
  },
  numObj: {
    is: (v: any): v is NumObj => v instanceof NumObj,
    get isRaw() {
      return isDbNumObj;
    },
    rawToState: (v: DbNumObj) => new NumObj(v),
    stateToRaw: (v: NumObj) => v.dbNumObj,
    updateFnNames: numObjUpdateFnNames,
    dbInitValue: {
      editorText: "",
      entities: [],
    },
    defaultInit: ({
      editorText = "",
      entities = [],
    }: Partial<NumObjCore> = {}) => new NumObj({ editorText, entities }),
    zod: z
      .any()
      .refine(
        (value) => value instanceof NumObj,
        "Expected a numObj but received something else."
      ),
    dbZod: zDbNumObj,
    mon: mDbNumObj,
    units: numObjUnits,
  },
} as const;

type ValueMeta = typeof valueMeta;

type RelValueTest = Record<ValueName, ValueMeta[keyof ValueMeta]>;
function testValues<T extends RelValueTest>(test: T): T {
  return test;
}
const _ = testValues(valueMeta);

const zDbValueArr = Object.values(valueMeta).map((schema) => schema.dbZod) as [
  z.ZodTypeAny,
  z.ZodTypeAny
];
export const zDbValue = z.union(zDbValueArr);
