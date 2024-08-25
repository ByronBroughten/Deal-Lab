import { Id } from "../../Ids/IdS";
import { SectionPack } from "../../SectionPacks/SectionPack";
import {
  ChildSpNums,
  OneRawSection,
  RawSections,
  SectionValuesGeneric,
} from "../../State/RawSection";
import { sectionsMeta } from "../../StateMeta/SectionsMeta";
import { Arr } from "../../utils/Arr";
import { ValidationError } from "../../utils/Error";
import { Obj } from "../../utils/Obj";
import { validateS } from "../../validateS";
import { sectionVarbNames } from "../derivedFromBaseSchemas/baseSectionsVarbsTypes";
import { validateSectionVarbValue } from "../derivedFromBaseSchemas/baseSectionValues";
import { SectionName, validateSectionName } from "../SectionName";
import { getChildNames } from "./ChildName";
import { selfAndDescSectionNames } from "./DescendantName";

export function validateSectionPackDuck<SN extends SectionName = any>(
  value: any,
  sectionName?: SN
): SectionPack<SN> {
  const obj = Obj.validateObjToAny(value) as SectionPack<SN>;
  if (sectionName) {
    if (obj.sectionName !== sectionName) {
      throw new ValidationError(
        `sectionPack sectionName of "${obj.sectionName}" does not match passed sectionName of ${sectionName}`
      );
    }
  }

  const validatedName = validateSectionName(obj.sectionName) as SN;
  return {
    sectionName: validatedName,
    dbId: Id.validate(obj.dbId),
    rawSections: validateRawSectionsDuck(obj.rawSections, validatedName),
  };
}

function validateRawSectionsDuck(value: any, sectionName: SectionName) {
  const obj = Obj.validateObjToAny(value) as RawSections;
  const sectionNames = selfAndDescSectionNames(sectionName);
  return sectionNames.reduce((raw, sectionName) => {
    if (sectionName in obj) {
      const arr = Arr.validateIsArray(obj[sectionName]);
      raw[sectionName] = arr.map((item) =>
        validateRawSectionDuck(item, sectionName)
      );
    } else {
      raw[sectionName] = [];
    }
    return raw;
  }, {} as RawSections);
}

function validateRawSectionDuck(
  value: any,
  sectionName: SectionName
): OneRawSection<any> {
  const obj = Obj.validateObjToAny(value) as OneRawSection<any>;
  return {
    spNum: validateS.number(obj.spNum),
    dbId: Id.validate(obj.dbId),
    sectionValues: validateSectionValuesDuck(obj.sectionValues, sectionName),
    childSpNums: validateChildSpNumsDuck(obj.childSpNums, sectionName),
  };
}

function validateSectionValuesDuck<SN extends SectionName>(
  values: any,
  sectionName: SN
): SectionValuesGeneric {
  const obj = Obj.validateObjToAny(values) as SectionValuesGeneric;
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((values, varbName) => {
    if (varbName in obj) {
      values[varbName] = validateSectionVarbValue(
        sectionName,
        varbName,
        obj[varbName]
      );
    } else {
      values[varbName] = sectionsMeta.varb({ sectionName, varbName }).initValue;
    }
    return values;
  }, {} as SectionValuesGeneric);
}

function validateChildSpNumsDuck<SN extends SectionName>(
  value: any,
  sectionName: SN
): ChildSpNums<SN> {
  const obj = Obj.validateObjToAny(value) as ChildSpNums<any>;
  const childNames = getChildNames(sectionName);
  return childNames.reduce((spNums, childName) => {
    if (childName in obj) {
      const arr = Arr.validateIsArray(obj[childName]);
      spNums[childName] = arr.map((val) => validateS.number(val));
    } else {
      spNums[childName] = [];
    }
    return spNums;
  }, {} as ChildSpNums<SN>);
}
