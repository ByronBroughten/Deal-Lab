import { Obj } from "../utils/Obj";
import { SubType } from "../utils/types";
import { ChildName } from "./childSectionsDerived/ChildName";
import { SectionName } from "./SectionName";

function childPath<SN extends SectionName, PT extends ChildName[]>(
  sectionName: SN,
  path: PT
) {
  return {
    sectionName,
    path,
  } as const;
}

export const childPaths = {
  get feUser() {
    return childPath("feUser", ["main", "feUser"]);
  },
  get activeDeal() {
    return childPath("deal", [...this.feUser.path, "activeDeal"]);
  },
  get activePropertyGeneral() {
    return childPath("propertyGeneral", [
      ...this.activeDeal.path,
      "propertyGeneral",
    ]);
  },
  get activeFinancing() {
    return childPath("financing", [...this.activeDeal.path, "financing"]);
  },
  get activeMgmtGeneral() {
    return childPath("mgmtGeneral", [...this.activeDeal.path, "mgmtGeneral"]);
  },
  get userVarbItemMain() {
    return childPath("userVarbList", [
      ...this.feUser.path,
      "userVarbListMain",
      "userVarbItem",
    ]);
  },
  get ongoingListMain() {
    return childPath("ongoingList", [...this.feUser.path, "ongoingListMain"]);
  },
  get ongoingItemMain() {
    return childPath("ongoingItem", [
      ...this.ongoingListMain.path,
      "ongoingItem",
    ]);
  },
  get singleTimeListMain() {
    return childPath("singleTimeList", [
      ...this.feUser.path,
      "singleTimeListMain",
    ]);
  },
  get singleTimeItemMain() {
    return childPath("singleTimeItem", [
      ...this.singleTimeListMain.path,
      "singleTimeItem",
    ]);
  },
} as const;

const childPathNames = Obj.keys(childPaths);
export function isChildPathName(value: any): value is ChildPathName {
  return childPathNames.includes(value);
}

type ChildPath<CPN extends ChildPathName> = ChildPaths[CPN]["path"];
export function getPath<CPN extends ChildPathName>(
  pathName: CPN
): ChildPath<CPN> {
  return childPaths[pathName]["path"];
}

type ChildPaths = typeof childPaths;
export type ChildPathName = keyof ChildPaths;

export type PathSectionName<CPN extends ChildPathName = ChildPathName> =
  ChildPaths[CPN]["sectionName"];

export type PathNameOfSection<SN extends SectionName> =
  keyof PathsOfSectionName<SN>;
type PathsOfSectionName<SN extends SectionName> = SubType<
  PathToSectionName,
  SN
>;
type PathToSectionName = {
  [CPN in ChildPathName]: PathSectionName<CPN>;
};
