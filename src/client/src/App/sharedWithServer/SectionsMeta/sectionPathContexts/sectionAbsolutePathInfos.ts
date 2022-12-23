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
  get dealActive() {
    return absolute("deal", ["main", "activeDeal"]);
  },
  get latent() {
    return absolute("latentSections", ["main", "latentSections"]);
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

  get dealLatent() {
    return absolute("deal", [...this.latent.path, "deal"]);
  },
  get propertyGeneralActive() {
    return absolute("propertyGeneral", [
      ...this.dealActive.path,
      "propertyGeneral",
    ]);
  },
  get propertyGeneralLatent() {
    return absolute("propertyGeneral", [
      ...this.dealLatent.path,
      "propertyGeneral",
    ]);
  },
  get financingActive() {
    return absolute("financing", [...this.dealActive.path, "financing"]);
  },
  get financingLatent() {
    return absolute("financing", [...this.dealLatent.path, "financing"]);
  },
  get mgmtGeneralActive() {
    return absolute("mgmtGeneral", [...this.dealActive.path, "mgmtGeneral"]);
  },
  get mgmtGeneralLatent() {
    return absolute("mgmtGeneral", [...this.dealLatent.path, "mgmtGeneral"]);
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
      "singleTimeList",
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
      "ongoingList",
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
      "userVarbList",
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
export type AbsolutePathName = typeof absolutePathNames[number];

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
