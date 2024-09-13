import {
  VarbName,
  VarbNameWide,
} from "../../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import {
  ParentName,
  ParentNameSafe,
} from "../../stateSchemas/fromSchema6SectionChildren/ParentName";
import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { StateValue } from "../../stateSchemas/schema4ValueTraits/StateValue";
import {
  SectionNameByType,
  sectionNameS,
  SectionNameType,
} from "../../stateSchemas/schema6SectionChildren/SectionNameByType";
import { IdS } from "../../utils/IdS";
import { SectionNameProp } from "./SectionNameProp";
import { VarbProp, VarbPropNext } from "./VarbInfoBase";

export interface FeInfoByType<T extends SectionNameType = "all"> {
  sectionName: SectionNameByType<T>;
  feId: string;
}
export type DbInfoByType<ST extends SectionNameType = "all"> = {
  sectionName: SectionNameByType<ST>;
  dbId: string;
};

export interface FeSectionInfo<SN extends SectionName = SectionName>
  extends SectionNameProp<SN> {
  feId: string;
}
export interface SectionArrInfo<SN extends SectionNameByType> {
  sectionName: SN;
  feIds: string;
}

export interface FeParentInfo<SN extends SectionNameByType> {
  sectionName: ParentName<SN>;
  feId: string;
}
export interface FeParentInfoSafe<SN extends SectionNameByType> {
  sectionName: ParentNameSafe<SN>;
  feId: string;
}

export interface FeVarbInfo<
  SN extends SectionNameByType = SectionNameByType<"hasVarb">
> extends FeSectionInfo<SN>,
    VarbProp {}

export interface SnVarbNames<
  SN extends SectionName = SectionName,
  VN extends VarbNameWide<SN> = VarbNameWide<SN>
> extends SectionNameProp<SN> {
  varbName: VN;
}

export interface FeVI<
  SN extends SectionName = SectionName,
  VN extends VarbNameWide<SN> = VarbNameWide<SN>
> extends FeSectionInfo<SN> {
  varbName: VN;
}

export const feInfoS = {
  isVarbInfo(value: any): value is FeVarbInfo {
    return (
      IdS.is(value.feId) &&
      sectionNameS.is(value.sectionName) &&
      typeof value.varbName === "string"
    );
  },
};

export function varbInfoToId(info: FeVarbInfo | FeVI): string {
  const { sectionName, varbName, feId } = info;
  return [sectionName, varbName, feId].join(".");
}

export function varbIdToInfo(varbId: string): FeVarbInfo {
  const [sectionName, varbName, feId] = varbId.split(".") as [
    SectionNameByType,
    string,
    string
  ];
  const info = { sectionName, varbName, feId };
  if (feInfoS.isVarbInfo(info)) return info;
  else throw new Error(`Was passed an invalid varbId: ${varbId}`);
}

export interface SectionVarbNames<
  SN extends SectionName = SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> extends SectionNameProp<SN>,
    VarbPropNext<SN, VN> {}

export interface FeVarbInfoNext<
  SN extends SectionName = SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> extends FeSectionInfo<SN>,
    VarbPropNext<SN, VN> {}

export interface FeVarbValueInfo<
  SN extends SectionNameByType = SectionNameByType<"hasVarb">
> extends FeVarbInfo<SN> {
  value: StateValue;
}
