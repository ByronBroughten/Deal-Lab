import { Obj } from "../utils/Obj";
import { SubType } from "../utils/types";
import { ChildName, isChildName } from "./childSectionsDerived/ChildName";
import { childToSectionName } from "./childSectionsDerived/ChildSectionName";
import { SectionName } from "./SectionName";

type ChildPath<SN extends SectionName, PT extends ChildName[] = ChildName[]> = {
  sectionName: SN;
  path: PT;
};
function childPath<SN extends SectionName, PT extends ChildName[]>(
  sectionName: SN,
  path: PT
): ChildPath<SN, PT> {
  return {
    sectionName,
    path,
  };
}

const absoluteVarbPaths = {
  get userVarbEditor() {
    return childPath("userVarbEditor", ["main", "userVarbEditor"]);
  },
  get userListEditor() {
    return childPath("userListEditor", ["main", "userListEditor"]);
  },
  get feUser() {
    return childPath("feUser", ["main", "feUser"]);
  },
  get activeDeal() {
    return childPath("deal", ["main", "activeDeal"]);
  },
  get propertyGeneralFocal() {
    return childPath("propertyGeneral", [
      ...this.activeDeal.path,
      "propertyGeneral",
    ]);
  },
  get financingFocal() {
    return childPath("financing", [...this.activeDeal.path, "financing"]);
  },
  get mgmtGeneralFocal() {
    return childPath("mgmtGeneral", [...this.activeDeal.path, "mgmtGeneral"]);
  },
  get userVarbItemStored() {
    return childPath("userVarbItem", [
      ...this.feUser.path,
      "userVarbListMain",
      "userVarbItem",
    ]);
  },
  get ongoingListStored() {
    return childPath("ongoingList", [...this.feUser.path, "ongoingListMain"]);
  },
  get ongoingItemStored() {
    return childPath("ongoingItem", [
      ...this.ongoingListStored.path,
      "ongoingItem",
    ]);
  },
  get singleTimeListStored() {
    return childPath("singleTimeList", [
      ...this.feUser.path,
      "singleTimeListMain",
    ]);
  },
  get singleTimeItemStored() {
    return childPath("singleTimeItem", [
      ...this.singleTimeListStored.path,
      "singleTimeItem",
    ]);
  },
  get singleTimeListEditor() {
    return childPath("singleTimeList", [
      ...this.userListEditor.path,
      "singleTimeList",
    ]);
  },
  get singleTimeItemEditor() {
    return childPath("singleTimeItem", [
      ...this.singleTimeListEditor.path,
      "singleTimeItem",
    ]);
  },
  get ongoingListEditor() {
    return childPath("ongoingList", [
      ...this.userListEditor.path,
      "ongoingList",
    ]);
  },
  get ongoingItemEditor() {
    return childPath("ongoingItem", [
      ...this.ongoingListEditor.path,
      "ongoingItem",
    ]);
  },
  get userVarbListEditor() {
    return childPath("userVarbList", [
      ...this.userVarbEditor.path,
      "userVarbList",
    ]);
  },
  get userVarbItemEditor() {
    return childPath("userVarbItem", [
      ...this.userVarbListEditor.path,
      "userVarbItem",
    ]);
  },
} as const;

function checkAbsoluteInfoPathTypes<T extends Record<string, SectionName>>(
  paths: T
) {
  return paths;
}

const absoluteInfoPathTypes = checkAbsoluteInfoPathTypes({
  dealFocal: "deal",
  propertyGeneralFocal: "propertyGeneral",
  financingFocal: "financing",
  mgmtGeneralFocal: "mgmtGeneral",
  userVarbItemMain: "userVarbItem",
  ongoingListMain: "ongoingList",
  ongoingItemMain: "ongoingItem",
  singleTimeListMain: "singleTimeList",
  singleTimeItemMain: "singleTimeItem",
});
type AbsoluteInfoPathTypes = typeof absoluteInfoPathTypes;
type AbsoluteInfoPathName = keyof AbsoluteInfoPathTypes;
type AbsoluteInfoSectionName<PN extends AbsoluteInfoPathName> =
  AbsoluteInfoPathTypes[PN];

type VarbPathContext = {
  [PN in AbsoluteInfoPathName]: ChildPath<AbsoluteInfoSectionName<PN>> | "skip";
};

function varbPathContext<T extends VarbPathContext>(context: T) {
  return context;
}

const varbPathContexts = {
  activeDealPage: varbPathContext({
    dealFocal: absoluteVarbPaths.activeDeal,
    propertyGeneralFocal: absoluteVarbPaths.propertyGeneralFocal,
    financingFocal: absoluteVarbPaths.financingFocal,
    mgmtGeneralFocal: absoluteVarbPaths.mgmtGeneralFocal,
    userVarbItemMain: absoluteVarbPaths.userVarbItemStored,
    ongoingListMain: absoluteVarbPaths.ongoingListStored,
    ongoingItemMain: absoluteVarbPaths.ongoingItemStored,
    singleTimeListMain: absoluteVarbPaths.singleTimeListStored,
    singleTimeItemMain: absoluteVarbPaths.singleTimeItemStored,
  }),
  userVarbEditorPage: varbPathContext({
    dealFocal: absoluteVarbPaths.activeDeal,
    propertyGeneralFocal: absoluteVarbPaths.propertyGeneralFocal,
    financingFocal: absoluteVarbPaths.financingFocal,
    mgmtGeneralFocal: absoluteVarbPaths.mgmtGeneralFocal,
    userVarbItemMain: absoluteVarbPaths.userVarbItemEditor,
    ongoingListMain: absoluteVarbPaths.ongoingListStored,
    ongoingItemMain: absoluteVarbPaths.ongoingItemStored,
    singleTimeListMain: absoluteVarbPaths.singleTimeListStored,
    singleTimeItemMain: absoluteVarbPaths.singleTimeItemStored,
  }),
  userListEditorPage: varbPathContext({
    dealFocal: absoluteVarbPaths.activeDeal,
    propertyGeneralFocal: absoluteVarbPaths.propertyGeneralFocal,
    financingFocal: absoluteVarbPaths.financingFocal,
    mgmtGeneralFocal: absoluteVarbPaths.mgmtGeneralFocal,
    userVarbItemMain: absoluteVarbPaths.userVarbItemStored,
    ongoingListMain: absoluteVarbPaths.ongoingListStored,
    ongoingItemMain: absoluteVarbPaths.ongoingItemStored,
    singleTimeListMain: absoluteVarbPaths.singleTimeListStored,
    singleTimeItemMain: absoluteVarbPaths.singleTimeItemStored,
  }),
  skipAll: varbPathContext({
    dealFocal: "skip",
    propertyGeneralFocal: "skip",
    financingFocal: "skip",
    mgmtGeneralFocal: "skip",
    userVarbItemMain: "skip",
    ongoingListMain: "skip",
    ongoingItemMain: "skip",
    singleTimeListMain: "skip",
    singleTimeItemMain: "skip",
  }),
} as const;

const defaultAbsoluteVarbPaths = varbPathContexts.activeDealPage;

export const childPathNames = Obj.keys(defaultAbsoluteVarbPaths);
export function isChildPathName(value: any): value is ChildPathName {
  return childPathNames.includes(value);
}

type ChildPathByName<CPN extends ChildPathName> = ChildPaths[CPN]["path"];
export function getPath<CPN extends ChildPathName>(
  pathName: CPN
): ChildPathByName<CPN> {
  return defaultAbsoluteVarbPaths[pathName]["path"];
}

type ChildPaths = typeof defaultAbsoluteVarbPaths;
export type ChildPathName = typeof childPathNames[number];

export function pathSectionName<PN extends ChildPathName>(
  pathName: PN
): PathSectionName<PN> {
  return defaultAbsoluteVarbPaths[pathName].sectionName;
}

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
  const { path, sectionName } = defaultAbsoluteVarbPaths[pathName];
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
