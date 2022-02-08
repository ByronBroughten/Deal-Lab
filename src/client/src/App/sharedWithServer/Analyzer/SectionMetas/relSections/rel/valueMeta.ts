import { z } from "zod";
import { reqMonNumber, reqMonString } from "../../../../utils/mongoose";
import { numObjUnits } from "../../../methods/solveVarbs/solveAndUpdateValue/updateNumericObjCalc";
import { BaseValue } from "../baseSections/baseVarbs";
import { mDbNumObj, NumObj, NumObjCore, zDbNumObj } from "./valueMeta/NumObj";
import { numObjUpdateFnNames } from "./valueMeta/NumObj/updateFnNames";

export const valueMeta = {
  number: {
    is: (v: any): v is number => typeof v === "number",
    updateFnNames: ["number"],
    defaultInit: () => 0,
    zod: z.number(),
    dbZod: z.number(),
    mon: reqMonNumber,
  },
  boolean: {
    is: (v: any): v is boolean => typeof v === "boolean",
    updateFnNames: ["boolean"],
    defaultInit: () => true,
    zod: z.boolean(),
    dbZod: z.boolean(),
    mon: { type: Boolean, required: true },
  },
  string: {
    is: (v: any): v is string => typeof v === "string",
    updateFnNames: ["string", "loadedString"],
    defaultInit: () => "",
    zod: z.string(),
    dbZod: z.string(),
    mon: reqMonString,
  },
  stringArray: {
    is: (v: any): v is string[] =>
      Array.isArray(v) && v.every((i: any) => typeof i === "string"),
    updateFnNames: ["stringArray"],
    defaultInit: () => [] as string[],
    zod: z.array(z.string()),
    dbZod: z.array(z.string()),
    mon: [reqMonString],
  },
  numObj: {
    is: (value: any) => value instanceof NumObj,
    updateFnNames: numObjUpdateFnNames,
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

type RelValueTest = Record<BaseValue, ValueMeta[keyof ValueMeta]>;
function testValues<T extends RelValueTest>(test: T): T {
  return test;
}
const _ = testValues(valueMeta);
