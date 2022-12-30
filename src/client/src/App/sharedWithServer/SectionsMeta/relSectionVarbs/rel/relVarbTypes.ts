import { ValueNamesToTypes } from "../../baseSectionsDerived/valueMetaTypes";
import { NumUnitName } from "../../baseSectionsVarbs/baseValues/calculations/numUnitParams";
import { ValueName } from "../../baseSectionsVarbs/baseVarb";
import { RelLocalVarbInfo } from "../../SectionInfo/RelVarbInfo";
import { UpdateFnName } from "./relVarb/UpdateFnName";
import { UpdateFnProps } from "./relVarb/UpdateFnProps";
import { UpdateOverrides } from "./relVarb/UpdateOverrides";

export type DisplayName = string | RelLocalVarbInfo;
export type CommonRelVarb = {
  virtualVarb: {
    value: string;
    displayName: string;
    displayNameEnd: string;
  } | null;
  updateFnProps: UpdateFnProps;
  updateOverrides: UpdateOverrides;

  displayName: DisplayName;
  displayNameStart: string;
  displayNameEnd: string;

  startAdornment: string;
  endAdornment: string;
};

export interface RelVarbByType<VN extends ValueName> extends CommonRelVarb {
  type: VN;
  updateFnName: UpdateFnName<VN>;
  initValue: ValueNamesToTypes[VN];
}

export type RelVarbsByType = {
  [VN in ValueName]: RelVarbByType<VN>;
} & {
  numObj: { unit: NumUnitName };
};

export type RelVarb<T extends ValueName = ValueName> = RelVarbsByType[T];

export type NumObjRelVarb = RelVarbsByType["numObj"];
export type StringRelVarb = RelVarbsByType["string"];
