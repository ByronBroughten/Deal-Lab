import { z } from "zod";
import { reqMonNumber, reqMonString } from "../../../../utils/mongoose";
import { BaseValue } from "../baseSections/baseVarbs";
import {
  mDbNumObj,
  NumObj,
  NumObjCore,
  numObjUnits,
  zDbNumObj,
} from "./relValue/numObj";
import { numObjUpdateFnNames } from "./relValue/numObj/updateFnNames";

export const relValue = {
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
    defaultInit: (props: Partial<NumObjCore> = {}) =>
      new NumObj({
        editorText: "",
        entities: [],
        updateFnName: numObjUpdateFnNames[0],
        solvableText: "",
        failedVarbs: [],
        unit: "money",
        ...props,
      }),
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

type RelValue = typeof relValue;

type RelValueTest = Record<BaseValue, RelValue[keyof RelValue]>;
function testValues<T extends RelValueTest>(test: T): T {
  return test;
}
const _ = testValues(relValue);
