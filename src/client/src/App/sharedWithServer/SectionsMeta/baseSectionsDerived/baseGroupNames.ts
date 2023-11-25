import { Replace } from "../../utils/types";
import {
  GroupKey,
  GroupName,
  GroupNameEnding,
  GroupVNGeneral,
} from "../GroupName";
import { SnProp } from "../SectionInfo/SectionNameProp";
import { SectionName } from "../SectionName";
import { VarbNameWide } from "./baseSectionsVarbsTypes";

export type GroupVarbName<
  SN extends SectionName = SectionName,
  GN extends GroupName = GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
> = Extract<VarbNameWide<SN>, GroupVNGeneral<GN, GK>>;

export type GroupVarbNameBase<
  SN extends SectionName = SectionName,
  GN extends GroupName = GroupName,
  GK extends GroupKey<GN> = GroupKey<GN>
> = Replace<GroupVarbName<SN, GN, GK>, GroupNameEnding, "">;

export interface SectionGroupBaseNames<
  GN extends GroupName,
  SN extends SectionName = SectionName,
  VN extends GroupVarbNameBase<SN, GN> = GroupVarbNameBase<SN, GN>
> extends SnProp<SN> {
  varbBaseName: VN;
}
