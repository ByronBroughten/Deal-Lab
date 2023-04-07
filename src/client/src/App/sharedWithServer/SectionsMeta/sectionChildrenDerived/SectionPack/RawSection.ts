import { z } from "zod";
import { Arr } from "../../../utils/Arr";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import { validateS } from "../../../validateS";
import { validateAnyVarbName } from "../../baseSectionsDerived/baseSectionsVarbsTypes";
import { Id } from "../../IdS";
import { SectionName } from "../../SectionName";
import { StateValue } from "../../values/StateValue";
import { validateStateValue, zValue } from "../../values/valueMetas";
import { ChildName, validateAnyChildName } from "../ChildName";

type GeneralChildNumArrs = Record<string, number[]>;
export type ChildSpNums<SN extends SectionName> = {
  [CHN in ChildName<SN>]: number[];
};

function validateChildSpNums(value: any): ChildSpNums<any> {
  const obj = Obj.validateObjToAny(value) as ChildSpNums<any>;
  for (const key of Obj.keys(obj)) {
    validateAnyChildName(key);
    const arr = Arr.validateIsArray(obj[key]);
    for (const item of arr) {
      validateS.number(item);
    }
  }
  return obj;
}

export type SpChildInfo<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  childName: CN;
  spNum: number;
};

export type SectionValuesGeneric = {
  [varbName: string]: StateValue;
};
function validateSectionValues(values: any): SectionValuesGeneric {
  const obj = Obj.validateObjToAny(values) as SectionValuesGeneric;
  for (const key of Obj.keys(obj)) {
    validateAnyVarbName(key);
    validateStateValue(obj[key]);
  }
  return obj;
}

export type GeneralRawSection = {
  spNum: number;
  feId: string;
  dbId: string;
  sectionValues: SectionValuesGeneric;
  childSpNums: GeneralChildNumArrs;
};
export type GeneralRawSections = {
  [key: string]: GeneralRawSection[];
};
export type OneRawSection<SN extends SectionName = SectionName> = {
  spNum: number;
  dbId: string;
  sectionValues: SectionValuesGeneric;
  childSpNums: ChildSpNums<SN>;
};
function validateRawSection(value: any): OneRawSection<any> {
  const obj = Obj.validateObjToAny(value) as OneRawSection<any>;
  return {
    spNum: validateS.number(obj.spNum),
    dbId: Id.validate(obj.dbId),
    sectionValues: validateSectionValues(obj.sectionValues),
    childSpNums: validateChildSpNums(obj.childSpNums),
  };
}

export type RawSections = {
  [descendantName: string]: OneRawSection[];
};
export type RawSection = RawSections[string][number];

export function validateRawSections(value: any): RawSections {
  const obj = Obj.validateObjToAny(value) as RawSections;
  for (const childName of Obj.keys(obj)) {
    validateAnyChildName(childName);
    const arr = Arr.validateIsArray(obj[childName]);
    for (const item of arr) {
      validateRawSection(item);
    }
  }
  return obj;
}

const zRawSectionFrame: Record<keyof OneRawSection, any> = {
  spNum: zS.number,
  dbId: zS.nanoId,
  sectionValues: z.record(zValue),
  childSpNums: z.record(z.array(zS.number)),
};

const zRawSection = z.object(zRawSectionFrame);
export const zRawSections = z.record(z.array(zRawSection));
