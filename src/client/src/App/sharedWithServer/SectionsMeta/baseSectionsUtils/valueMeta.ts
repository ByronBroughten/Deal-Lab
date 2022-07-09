import { z } from "zod";
import { numObjUnits } from "../../StateSolvers/SolveValueVarb/solveText";
import { reqMonNumber, reqMonString } from "../../utils/mongoose";
import { isNumObj, mDbNumObj, NumObj, zNumObj } from "./baseValues/NumObj";
import { numObjUpdateFnNames } from "./baseValues/updateFnNames";
import { ValueName } from "./baseVarb";

export const valueMeta = {
  number: {
    is: (v: any): v is number => typeof v === "number",
    updateFnNames: ["number"],
    initDefault: () => 0,
    zod: z.number(),
    mon: reqMonNumber,
  },
  boolean: {
    is: (v: any): v is boolean => typeof v === "boolean",
    updateFnNames: ["boolean"],
    initDefault: () => true,
    zod: z.boolean(),
    mon: { type: Boolean, required: true },
  },
  string: {
    is: (v: any): v is string => typeof v === "string",
    updateFnNames: ["string", "loadedString"],
    initDefault: () => "",
    zod: z.string(),
    mon: reqMonString,
  },
  stringArray: {
    is: (v: any): v is string[] =>
      Array.isArray(v) && v.every((i: any) => typeof i === "string"),
    updateFnNames: ["stringArray"],
    initDefault: () => [] as string[],
    zod: z.array(z.string()),
    mon: [reqMonString],
  },
  numObj: {
    is: isNumObj,
    updateFnNames: numObjUpdateFnNames,
    initDefault: ({
      editorText = "",
      entities = [],
      solvableText = editorText,
    }: Partial<NumObj> = {}) => ({
      editorText,
      entities,
      solvableText,
    }),
    zod: zNumObj,
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

const zValueArr = Object.values(valueMeta).map((schema) => schema.zod) as [
  z.ZodTypeAny,
  z.ZodTypeAny
];
export const zValue = z.union(zValueArr);
