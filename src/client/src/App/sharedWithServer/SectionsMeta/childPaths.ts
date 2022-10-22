import { Obj } from "../utils/Obj";
import { SubType } from "../utils/types";
import { ChildName, isChildName } from "./childSectionsDerived/ChildName";
import { childToSectionName } from "./childSectionsDerived/ChildSectionName";
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
    return childPath("deal", ["main", "activeDeal"]);
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
    return childPath("userVarbItem", [
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

export function checkChildPaths() {
  for (const pathName of childPathNames) {
    checkChildPath(pathName);
  }
}
function checkChildPath(pathName: ChildPathName) {
  const { path, sectionName } = childPaths[pathName];
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
