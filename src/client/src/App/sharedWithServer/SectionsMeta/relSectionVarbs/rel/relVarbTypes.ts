import { DisplayName } from "../../allDisplaySectionVarbs";
import { ValueNamesToTypes } from "../../baseSectionsDerived/valueMetaTypes";
import { NumUnitName } from "../../baseSectionsVarbs/baseValues/calculations/numUnitParams";
import { ValueName } from "../../baseSectionsVarbs/baseVarbDepreciated";
import { UpdateProps } from "./relVarb/UpdateProps";

export type CommonRelVarb = {
  displayName: DisplayName;
  displayNameStart: string;
  displayNameEnd: string;
  startAdornment: string;
  endAdornment: string;
};

export interface RelVarbByType<VN extends ValueName>
  extends CommonRelVarb,
    UpdateProps<VN> {
  valueName: VN;
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
