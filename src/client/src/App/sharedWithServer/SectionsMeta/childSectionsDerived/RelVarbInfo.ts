import { SimpleSectionName } from "../baseSections";
import { VarbProp } from "../baseSectionsDerived/baseVarbInfo";
import { ChildName } from "./ChildName";
import { ParentName } from "./ParentName";
import {
  RelAllInfo,
  RelChildrenInfo,
  RelParentInfo,
  RelStaticInfo,
} from "./RelInfo";

export interface RelChildrenVarbInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends RelChildrenInfo<SN, CN>,
    VarbProp {}

export interface RelParentVarbInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  PN extends ParentName<SN> = ParentName<SN>
> extends RelParentInfo<SN, PN>,
    VarbProp {}

interface RelStaticVarbInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  STN extends SimpleSectionName = SimpleSectionName
> extends RelStaticInfo<SN, STN>,
    VarbProp {}
interface RelAllVarbInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  AN extends SimpleSectionName = SimpleSectionName
> extends RelAllInfo<SN, AN>,
    VarbProp {}

// "static" | "local" | "children" | "all"

export type RelInVarbInfo<SN extends SimpleSectionName = SimpleSectionName> =
  | RelChildrenVarbInfo<SN>
  | RelParentVarbInfo<SN>
  | RelStaticVarbInfo<SN>
  | RelAllVarbInfo<SN>;

export const relVarbInfoS = {
  children<SN extends SimpleSectionName, CN extends ChildName<SN>>(
    sectionName: SN,
    childName: CN,
    varbName: string
  ): RelChildrenVarbInfo<SN, CN> {
    return {
      sectionName,
      id: childName,
      varbName,
      idType: "children",
    };
  },
};
