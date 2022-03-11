import { z } from "zod";
import { NumObj, NumObjCore, zDbNumObj } from "./baseValues/NumObj";

export const baseValueNames = [
  "number",
  "boolean",
  "string",
  "stringArray",
  "numObj",
] as const;
export type BaseValueName = typeof baseValueNames[number];

type GeneralBaseValues = Record<BaseValueName, GeneralBaseValue>;
type GeneralBaseValue = {
  is: (v: any) => boolean;
  defaultInit: () => any;
  zod: z.ZodTypeAny;
  dbZod: z.ZodTypeAny;
};

export const baseValues = {
  number: {
    is: (v: any): v is number => typeof v === "number",
    defaultInit: () => 0,
    zod: z.number(),
    dbZod: z.number(),
  },
  boolean: {
    is: (v: any): v is boolean => typeof v === "boolean",
    defaultInit: () => true,
    zod: z.boolean(),
    dbZod: z.boolean(),
  },
  string: {
    is: (v: any): v is string => typeof v === "string",
    defaultInit: () => "",
    zod: z.string(),
    dbZod: z.string(),
  },
  stringArray: {
    is: (v: any): v is string[] =>
      Array.isArray(v) && v.every((i: any) => typeof i === "string"),
    updates: {},
    defaultInit: () => [] as string[],
    zod: z.array(z.string()),
    dbZod: z.array(z.string()),
  },
  numObj: {
    is: (value: any) => value instanceof NumObj,
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
  },
} as const;
const testBaseValues = <T extends GeneralBaseValues>(_: T) => undefined;
testBaseValues(baseValues);

export type BaseValues = typeof baseValues;
export type BaseValueTypes = {
  [Prop in keyof BaseValues]: ReturnType<BaseValues[Prop]["defaultInit"]>;
};
export type BaseValue<T extends keyof BaseValueTypes = keyof BaseValueTypes> =
  BaseValueTypes[T];
