import { z } from "zod";
import { timeS } from "../../utils/date";
import { reqMonNumber, reqMonString } from "../../utils/mongoose";
import {
  InEntityInfoValue,
  isInEntityVarbInfoValue,
  mInEntityVarbInfoValue,
  zInEntityVarbInfoValue,
} from "../baseSectionsUtils/baseValues/InEntityInfoValue";
import {
  isNumObj,
  mDbNumObj,
  NumObj,
  zNumObj,
} from "../baseSectionsUtils/baseValues/NumObj";
import {
  initDefaultStringObj,
  isStringObj,
  mStringObj,
  zStringObj,
} from "../baseSectionsUtils/baseValues/StringObj";
import { numObjUpdateFnNames } from "../baseSectionsUtils/baseValues/updateFnNames";
import { ValueName } from "../baseSectionsUtils/baseVarb";

export const valueMeta = {
  number: {
    is: (v: any): v is number => typeof v === "number",
    updateFnNames: ["updateByEditorOnly", "number"],
    initDefault: () => 0,
    zod: z.number(),
    mon: reqMonNumber,
  },
  dateTime: {
    is: (v: any): v is number => typeof v === "number",
    updateFnNames: ["updateByEditorOnly", "number"],
    initDefault: () => timeS.now(),
    zod: z.number(),
    mon: reqMonNumber,
  },
  boolean: {
    is: (v: any): v is boolean => typeof v === "boolean",
    updateFnNames: ["updateByEditorOnly"],
    initDefault: () => true,
    zod: z.boolean(),
    mon: { type: Boolean, required: true },
  },
  string: {
    is: (v: any): v is string => typeof v === "string",
    updateFnNames: ["string", "updateByEditorOnly", "displayNameFullVirtual"],
    initDefault: () => "",
    zod: z.string(),
    mon: reqMonString,
  },
  stringObj: {
    is: isStringObj,
    updateFnNames: [
      "stringObj",
      "loadLocalString",
      "updateByEditorOnly",
      "loadDisplayName",
      "loadDisplayNameEnd",
      "loadStartAdornment",
      "loadEndAdornment",
      "emptyStringObj",
    ],
    initDefault: initDefaultStringObj,
    zod: zStringObj,
    mon: mStringObj,
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
  },
  inEntityInfo: {
    is: isInEntityVarbInfoValue,
    updateFnNames: ["inEntityInfo"],
    initDefault: () => null as InEntityInfoValue,
    zod: zInEntityVarbInfoValue,
    mon: mInEntityVarbInfoValue,
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
