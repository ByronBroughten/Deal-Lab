import { VarbName } from "../fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { VarbValueName } from "../fromSchema3SectionStructures/baseSectionValues";
import { ValueName } from "../schema1ValueNames";
import { SectionName } from "../schema2SectionNames";
import { InEntityValue } from "./StateValue/InEntityValue";
import { NumObj } from "./StateValue/NumObj";
import { ChangesSaving, ChangesToSave } from "./StateValue/sectionChanges";
import { StringObj } from "./StateValue/StringObj";
import { UnionValueNamesToTypes } from "./StateValue/unionValues";

export type StateValue<VN extends ValueName = ValueName> =
  ValueNamesToTypes[VN];

interface ValueNamesToTypes extends UnionValueNamesToTypes {
  string: string;
  number: number;
  boolean: boolean;
  dateTime: number;
  stringArray: string[];
  stringObj: StringObj;
  numObj: NumObj;
  inEntityValue: InEntityValue;
  changesToSave: ChangesToSave;
  changesSaving: ChangesSaving;
}
type Check<T extends Record<ValueName, any>> = T;
type _Test = Check<ValueNamesToTypes>;

type ValueTypesPlusAny = ValueNamesToTypes & { any: StateValue };
export type ValueNameOrAny = ValueName | "any";
export type StateValueOrAny<VN extends ValueNameOrAny> = ValueTypesPlusAny[VN];

export type SectionValues<SN extends SectionName> = {
  [VN in VarbName<SN>]: ValueNamesToTypes[VarbValueName<SN, VN>];
};

export type VarbValue<
  SN extends SectionName,
  VN extends VarbName<SN>
> = SectionValues<SN>[VN];
