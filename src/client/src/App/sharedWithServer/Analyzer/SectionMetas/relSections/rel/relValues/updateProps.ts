import { BaseValueTypes } from "../../baseSections/baseValues";
import {
  FinishingTouch,
  NumObjNumber,
} from "../../baseSections/baseValues/NumObj";
import { NumberEntity } from "./numObjUpdateInfos/equationVarbUpdate";
import { ConditionalRowValues } from "./numObjUpdateInfos/userVarbUpdate";

export type RelSpecifiedPropSchemas = {
  [Prop in keyof BaseValueTypes]: {
    isMulti: false;
    type: BaseValueTypes[Prop];
    sources: [Prop];
  };
} & {
  numObjNum: { isMulti: false; type: NumObjNumber; sources: ["numObj"] };
  numObjNums: { isMulti: true; type: NumObjNumber[]; sources: ["numObj"] };
};

type UpdatePropTypes = {
  relSpecified: {
    [Prop in keyof RelSpecifiedPropSchemas]: RelSpecifiedPropSchemas[Prop]["type"];
  };
  inherent: UpdatePropTypes["relSpecified"] & {
    undefined: undefined;
    conditionalRowValuesArr: ConditionalRowValues[];
    finishingTouch: FinishingTouch;
    numberEntities: NumberEntity[];
  };
};

export type UpdatePropValues = UpdatePropTypes["inherent"];
export type UpdatePropValueName = keyof UpdatePropValues;
export type UpdatePropTypeName = keyof UpdatePropValues;
export type RelUpdatePropTypeName = keyof UpdatePropTypes["relSpecified"];
export type ValueNameArrObjToValueObj<
  O extends { [propName: string]: readonly UpdatePropValueName[] }
> = {
  [Prop in keyof O]: UpdatePropValues[O[Prop][number]];
};
