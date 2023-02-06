import { Obj } from "../../utils/Obj";
import { isChildName } from "../sectionChildrenDerived/ChildName";
import { childToSectionName } from "../sectionChildrenDerived/ChildSectionName";
import { absolutePathInfo } from "../SectionInfo/AbsolutePathInfo";
import { SectionName } from "../SectionName";

const absolute = absolutePathInfo;

export const sectionAbsolutePathInfos = {
  get userVarbEditor() {
    return absolute("userVarbEditor", ["main", "userVarbEditor"]);
  },
  get userListEditor() {
    return absolute("userListEditor", ["main", "userListEditor"]);
  },
  get feUser() {
    return absolute("feUser", ["main", "feUser"]);
  },
  get active() {
    return absolute("dealPage", ["main", "activeDealPage"]);
  },
  get latent() {
    return absolute("latentSections", ["main", "latentSections"]);
  },
  get dealActive() {
    return absolute("deal", [...this.active.path, "deal"]);
  },
  get dealLatent() {
    return absolute("deal", [...this.latent.path, "deal"]);
  },
  get calculatedVarbsActive() {
    return absolute("calculatedVarbs", [
      ...this.active.path,
      "calculatedVarbs",
    ]);
  },
  get calculatedVarbsLatent() {
    return absolute("calculatedVarbs", [
      ...this.latent.path,
      "calculatedVarbs",
    ]);
  },
  get userVarbItemLatent() {
    return absolute("userVarbItem", [
      ...this.latent.path,
      "userVarbList",
      "userVarbItem",
    ]);
  },
  get singleTimeListLatent() {
    return absolute("singleTimeList", [...this.latent.path, "singleTimeList"]);
  },
  get singleTimeItemLatent() {
    return absolute("singleTimeItem", [
      ...this.singleTimeListLatent.path,
      "singleTimeItem",
    ]);
  },
  get ongoingListLatent() {
    return absolute("ongoingList", [...this.latent.path, "ongoingList"]);
  },
  get ongoingItemLatent() {
    return absolute("ongoingItem", [
      ...this.ongoingListLatent.path,
      "ongoingItem",
    ]);
  },

  get mgmtActive() {
    return absolute("mgmt", [...this.dealActive.path, "mgmt"]);
  },
  get financingActive() {
    return absolute("financing", [...this.dealActive.path, "financing"]);
  },
  get financingLatent() {
    return absolute("financing", [...this.dealLatent.path, "financing"]);
  },
  get loanActive() {
    return absolute("loan", [...this.financingActive.path, "loan"]);
  },
  get loanLatent() {
    return absolute("loan", [...this.financingLatent.path, "loan"]);
  },
  get closingCostActive() {
    return absolute("closingCostValue", [
      ...this.loanActive.path,
      "closingCostValue",
    ]);
  },
  get closingCostLatent() {
    return absolute("closingCostValue", [
      ...this.loanLatent.path,
      "closingCostValue",
    ]);
  },
  get mgmtLatent() {
    return absolute("mgmt", [...this.dealLatent.path, "mgmt"]);
  },
  get propertyActive() {
    return absolute("property", [...this.dealActive.path, "property"]);
  },
  get propertyLatent() {
    return absolute("property", [...this.dealLatent.path, "property"]);
  },
  get unitActive() {
    return absolute("unit", [...this.propertyActive.path, "unit"]);
  },
  get unitLatent() {
    return absolute("unit", [...this.propertyLatent.path, "unit"]);
  },
  get repairValueActive() {
    return absolute("repairValue", [
      ...this.propertyActive.path,
      "repairValue",
    ]);
  },
  get repairValueLatent() {
    return absolute("repairValue", [
      ...this.propertyLatent.path,
      "repairValue",
    ]);
  },
  get utilityCostValueActive() {
    return absolute("utilityValue", [
      ...this.propertyActive.path,
      "utilityValue",
    ]);
  },
  get utilityCostValueLatent() {
    return absolute("utilityValue", [
      ...this.propertyLatent.path,
      "utilityValue",
    ]);
  },
  get maintenanceCostValueActive() {
    return absolute("maintenanceValue", [
      ...this.propertyActive.path,
      "maintenanceValue",
    ]);
  },
  get maintenanceCostValueLatent() {
    return absolute("maintenanceValue", [
      ...this.propertyLatent.path,
      "maintenanceValue",
    ]);
  },
  get capExCostValueActive() {
    return absolute("capExValue", [...this.propertyActive.path, "capExValue"]);
  },
  get capExCostValueLatent() {
    return absolute("capExValue", [...this.propertyLatent.path, "capExValue"]);
  },
  get userVarbItemStored() {
    return absolute("userVarbItem", [
      ...this.feUser.path,
      "userVarbListMain",
      "userVarbItem",
    ]);
  },
  get ongoingListStored() {
    return absolute("ongoingList", [...this.feUser.path, "ongoingListMain"]);
  },
  get ongoingItemStored() {
    return absolute("ongoingItem", [
      ...this.ongoingListStored.path,
      "ongoingItem",
    ]);
  },
  get singleTimeListStored() {
    return absolute("singleTimeList", [
      ...this.feUser.path,
      "singleTimeListMain",
    ]);
  },
  get singleTimeItemStored() {
    return absolute("singleTimeItem", [
      ...this.singleTimeListStored.path,
      "singleTimeItem",
    ]);
  },
  get singleTimeListEditor() {
    return absolute("singleTimeList", [
      ...this.userListEditor.path,
      "singleTimeListMain",
    ]);
  },
  get singleTimeItemEditor() {
    return absolute("singleTimeItem", [
      ...this.singleTimeListEditor.path,
      "singleTimeItem",
    ]);
  },
  get ongoingListEditor() {
    return absolute("ongoingList", [
      ...this.userListEditor.path,
      "ongoingListMain",
    ]);
  },
  get ongoingItemEditor() {
    return absolute("ongoingItem", [
      ...this.ongoingListEditor.path,
      "ongoingItem",
    ]);
  },
  get userVarbListEditor() {
    return absolute("userVarbList", [
      ...this.userVarbEditor.path,
      "userVarbListMain",
    ]);
  },
  get userVarbItemEditor() {
    return absolute("userVarbItem", [
      ...this.userVarbListEditor.path,
      "userVarbItem",
    ]);
  },
} as const;

const absolutePathNames = Obj.keys(sectionAbsolutePathInfos);
type AbsolutePathName = typeof absolutePathNames[number];

export function checkAbsolutePathInfos() {
  for (const pathName of absolutePathNames) {
    checkAbsolutePathInfo(pathName);
  }
}
function checkAbsolutePathInfo(pathName: AbsolutePathName) {
  const { path, sectionName } = sectionAbsolutePathInfos[pathName];
  let focalSn = "root" as SectionName;
  for (const name of path) {
    if (isChildName(focalSn, name)) {
      focalSn = childToSectionName(focalSn, name);
    } else {
      throw new Error(
        `Failed childPath check: "${name}" is not a childName of ${focalSn}`
      );
    }
  }
  if (focalSn !== sectionName) {
    throw new Error(
      `The childPath "${path}" ends with name of type ${focalSn} but was declared as ${sectionName}`
    );
  }
}
