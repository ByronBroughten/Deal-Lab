import { Obj } from "../utils/Obj";
import { ChildName, isChildName } from "./sectionChildrenDerived/ChildName";
import { childToSectionName } from "./sectionChildrenDerived/ChildSectionName";
import {
  absolutePathInfo,
  AbsolutePathInfo,
} from "./SectionInfo/AbsolutePathInfo";
import { SectionName } from "./SectionName";
import {
  SectionNameOfPath,
  SectionPathName,
  sectionPathNames,
} from "./sectionPathContexts/sectionPathNames";

const abs = absolutePathInfo;
function makeDealPageFocals(dealPagePath: ChildName[]) {
  const dealPath: ChildName[] = [...dealPagePath, "deal"];
  const propertyPath: ChildName[] = [...dealPath, "property"];
  const financingPath: ChildName[] = [...dealPath, "financing"];
  const userVarbListPath: ChildName[] = [...dealPagePath, "userVarbList"];
  return {
    get userVarbListMain() {
      return abs("userVarbList", userVarbListPath);
    },
    get userVarbItemMain() {
      return abs("userVarbItem", [...userVarbListPath, "userVarbItem"]);
    },
    get calculatedVarbsFocal() {
      return abs("calculatedVarbs", [...dealPagePath, "calculatedVarbs"]);
    },
    get dealFocal() {
      return abs("deal", dealPath);
    },
    get propertyFocal() {
      return abs("property", propertyPath);
    },
    get unitFocal() {
      return abs("unit", [...propertyPath, "unit"]);
    },
    get repairCostFocal() {
      return abs("repairValue", [...propertyPath, "repairValue"]);
    },
    get utilityCostFocal() {
      return abs("utilityValue", [...propertyPath, "utilityValue"]);
    },
    get capExCostFocal() {
      return abs("capExValue", [...propertyPath, "capExValue"]);
    },
    get maintenanceCostFocal() {
      return abs("maintenanceValue", [...propertyPath, "maintenanceValue"]);
    },
    get financingFocal() {
      return abs("financing", financingPath);
    },
    get loanFocal() {
      return abs("loan", [...financingPath, "loan"]);
    },
    get closingCostFocal() {
      return abs("closingCostValue", [
        ...this.loanFocal.path,
        "closingCostValue",
      ]);
    },
    get mgmtFocal() {
      return abs("mgmt", [...dealPath, "mgmt"]);
    },
  };
}

const activeDealPage = makeDealPageFocals(["main", "activeDealPage"]);
const latentDealPage = makeDealPageFocals([
  "main",
  "latentSections",
  "dealPage",
]);
const compareDealPage = makeDealPageFocals([
  "main",
  "dealCompare",
  "compareDealPage",
]);
const editorVarbListPath: ChildName[] = [
  "main",
  "userVarbEditor",
  "userVarbListMain",
];
export const sectionPathContexts = {
  get default() {
    return this.activeDealPage;
  },
  compareDealPage: sectionPathContext(compareDealPage),
  activeDealPage: sectionPathContext(activeDealPage),
  userVarbEditorPage: sectionPathContext({
    ...activeDealPage,
    userVarbListMain: abs("userVarbList", editorVarbListPath),
    userVarbItemMain: abs("userVarbItem", [
      ...editorVarbListPath,
      "userVarbItem",
    ]),
  }),
  userListEditorPage: sectionPathContext(activeDealPage),
  latentSection: sectionPathContext(latentDealPage),
} as const;

type SectionPathContexts = typeof sectionPathContexts;
export type SectionPathContextName = keyof SectionPathContexts;
const sectionPathContextNames = Obj.keys(sectionPathContexts);
type SectionPathContext<SPCN extends SectionPathContextName> =
  SectionPathContexts[SPCN];

export type SectionPathContextGeneric = {
  [PN in SectionPathName]: AbsolutePathInfo<SectionNameOfPath<PN>>;
};
function sectionPathContext<T extends SectionPathContextGeneric>(context: T) {
  return context;
}

export function getSectionPathContext<SPCN extends SectionPathContextName>(
  contextName: SPCN
): SectionPathContext<SPCN> {
  return sectionPathContexts[contextName];
}

export function checkSectionContextPaths() {
  for (const contextName of sectionPathContextNames) {
    for (const pathName of sectionPathNames) {
      checkSectionContextPath(contextName, pathName);
    }
  }
}
function checkSectionContextPath(
  contextName: SectionPathContextName,
  pathName: SectionPathName
): void {
  const { path, sectionName } = sectionPathContexts[contextName][pathName];
  let focalSn: SectionName = "root";
  for (const name of path) {
    if (isChildName(focalSn, name)) {
      focalSn = childToSectionName(focalSn, name);
    } else {
      throw new Error(
        `Failed childPath check: "${name}" is not a childName of ${focalSn}`
      );
    }
  }
  if (focalSn !== (sectionName as SectionName)) {
    throw new Error(
      `The childPath "${path}" ends with name of type ${focalSn} but was declared as ${sectionName}`
    );
  }
}
