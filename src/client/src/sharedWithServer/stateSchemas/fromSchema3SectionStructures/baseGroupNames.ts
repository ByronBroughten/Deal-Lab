import { SnProp } from "../../StateGetters/Identifiers/SectionNameProp";
import { Replace } from "../../utils/types";
import { SectionName } from "../schema2SectionNames";
import {
  GroupKey,
  GroupName,
  GroupNameEnding,
  GroupVNGeneral,
} from "../schema3SectionStructures/GroupName";
import { VarbNameWide } from "./baseSectionsVarbsTypes";

export type SectionGroupVarbName<
  SN extends SectionName = SectionName,
  GN extends GroupName = GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
> = Extract<VarbNameWide<SN>, GroupVNGeneral<GN, GK>>;

export type GroupVarbNameBase<
  GN extends GroupName = GroupName,
  SN extends SectionName = SectionName
> = Replace<SectionGroupVarbName<SN, GN>, GroupNameEnding, "">;

export interface SectionGroupBaseNames<
  GN extends GroupName,
  SN extends SectionName = SectionName,
  VN extends GroupVarbNameBase<GN, SN> = GroupVarbNameBase<GN, SN>
> extends SnProp<SN> {
  varbBaseName: VN;
}

export interface GroupBaseVI<
  GN extends GroupName,
  SN extends SectionName = SectionName,
  BN extends GroupVarbNameBase<GN, SN> = GroupVarbNameBase<GN, SN>
> {
  sectionName: SN;
  varbBaseName: BN;
  feId: string;
}
