import { VarbNames } from "../baseSectionsDerived/baseVarbInfo";
import { SimpleSectionName } from "../baseSectionsVarbs";
import { childToSectionNames } from "./ChildSectionName";
import { ParentName } from "./ParentName";
import {
  RelChildrenVarbInfo,
  RelLocalVarbInfo,
  RelNiblingOfChildVarbInfo,
  RelParentVarbInfo,
  RelPiblingVarbInfo,
  RelStepSiblingOfChildVarbInfo,
  RelStepSiblingVarbInfo,
} from "./RelVarbInfo";

export type RelInVarbInfo<SN extends SimpleSectionName = SimpleSectionName> =
  | RelLocalVarbInfo
  | RelChildrenVarbInfo<SN>
  | RelStepSiblingVarbInfo<SN>
  | RelPiblingVarbInfo<SN>;

export type RelSingleInVarbInfo<
  SN extends SimpleSectionName = SimpleSectionName
> = RelInVarbInfo<SN> & { expectedCount: "onlyOne" };

export type RelOutVarbInfo =
  | RelLocalVarbInfo
  | RelParentVarbInfo
  | RelStepSiblingOfChildVarbInfo
  | RelNiblingOfChildVarbInfo;

type InVarbInfoToOutSectionNameProps = {
  sectionNameWithInVarb: SimpleSectionName;
  inVarbInfo: RelInVarbInfo;
};
export function inVarbInfoToOutSectionName({
  sectionNameWithInVarb,
  inVarbInfo,
}: InVarbInfoToOutSectionNameProps): SimpleSectionName {
  switch (inVarbInfo.infoType) {
    case "local":
      return sectionNameWithInVarb;
    case "children": {
      const cnsToSn = childToSectionNames[sectionNameWithInVarb] as Record<
        string,
        SimpleSectionName
      >;
      const sn = cnsToSn[inVarbInfo.childName];
      if (sn === undefined) {
        throw new Error(
          `"${inVarbInfo.childName}" is not a child of "${sectionNameWithInVarb}"`
        );
      }
      return sn;
    }
    case "pibling": {
      return inVarbInfo.piblingSectionName;
    }
    case "stepSibling": {
      return inVarbInfo.stepSiblingSectionName;
    }
  }
}

type InToOutVarbInfoProps = {
  namesOfVarbWithInVarb: VarbNames;
  inVarbInfo: RelInVarbInfo;
};
export function relInToOutVarbInfo({
  namesOfVarbWithInVarb: { sectionName, varbName },
  inVarbInfo,
}: InToOutVarbInfoProps): RelOutVarbInfo {
  switch (inVarbInfo.infoType) {
    case "local": {
      return {
        ...inVarbInfo,
        varbName,
      };
    }
    case "children": {
      const relParentInfo: RelParentVarbInfo = {
        infoType: "parent",
        parentName: sectionName as ParentName,
        varbName: varbName,
        expectedCount: "onlyOne",
      };
      return relParentInfo;
    }
    case "stepSibling": {
      const relStepSiblingOfChildInfo: RelStepSiblingOfChildVarbInfo = {
        infoType: "stepSiblingOfHasChildName",
        selfChildName: inVarbInfo.stepSiblingName,
        stepSiblingSectionName: sectionName,
        varbName: varbName,
        expectedCount: "multiple",
      };
      return relStepSiblingOfChildInfo;
    }
    case "pibling": {
      const relNiblingOfChildInfo: RelNiblingOfChildVarbInfo = {
        infoType: "niblingIfOfHasChildName",
        niblingSectionName: sectionName,
        selfChildName: inVarbInfo.piblingName,
        varbName: varbName,
        expectedCount: "multiple",
      };
      return relNiblingOfChildInfo;
    }
  }
}
