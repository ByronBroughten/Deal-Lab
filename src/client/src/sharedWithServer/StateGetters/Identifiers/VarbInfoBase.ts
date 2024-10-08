import { VarbName } from "../../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { schema2SectionStructures } from "../../stateSchemas/schema3SectionStructures";
import { Obj } from "../../utils/Obj";
import { NanoIdProp } from "./NanoIdInfo";
import { SectionNameProp } from "./SectionNameProp";

export type MixedInfoProps<IT extends string> = {
  infoType: IT;
};

export interface GlobalSectionInfo<SN extends SectionName = SectionName>
  extends MixedInfoProps<"globalSection">,
    SectionNameProp<SN> {}
export interface GlobalVarbInfo<SN extends SectionName = SectionName>
  extends GlobalSectionInfo<SN>,
    VarbProp {}

export interface DbSectionInfoMixed<SN extends SectionName = SectionName>
  extends MixedInfoProps<"dbId">,
    NanoIdProp,
    SectionNameProp<SN> {}
export interface DbVarbInfoMixed<SN extends SectionName = SectionName>
  extends DbSectionInfoMixed<SN>,
    VarbProp {}

export interface FeSectionInfoMixed<SN extends SectionName = SectionName>
  extends MixedInfoProps<"feId">,
    NanoIdProp,
    SectionNameProp<SN> {}
export interface FeVarbInfoMixed<SN extends SectionName = SectionName>
  extends FeSectionInfoMixed<SN>,
    VarbProp {}

export type VarbProp = { varbName: string };
export function isVarbName(value: any): value is string {
  return typeof value === "string";
}

export interface MakeVarbProp<VN extends any> {
  varbName: VN;
}
export interface VarbPropNext<
  SN extends SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> extends MakeVarbProp<VN> {}

export interface VarbNamesNext<
  SN extends SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> extends SectionNameProp<SN>,
    VarbPropNext<SN, VN> {}

export interface VarbNames<SN extends SectionName = SectionName>
  extends SectionNameProp<SN>,
    VarbProp {}

export function isValidVarbNames({ sectionName, varbName }: VarbNames) {
  const varbNames = Obj.keys(schema2SectionStructures[sectionName]) as string[];
  if (varbNames.includes(varbName)) return true;
  else return false;
}
