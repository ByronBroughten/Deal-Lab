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
function makeDealFocals(dealPath: ChildName[]) {
  const propertyPath: ChildName[] = [...dealPath, "property"];
  const financingPath: ChildName[] = [...dealPath, "purchaseFinancing"];
  const loanPath: ChildName[] = [...financingPath, "loan"];
  const loanBasePath: ChildName[] = [...loanPath, "loanBaseValue"];
  const mgmtPath: ChildName[] = [...dealPath, "mgmt"];
  return {
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
      return abs("utilityValue", [...propertyPath, "utilityOngoing"]);
    },
    get capExCostFocal() {
      return abs("capExValue", [...propertyPath, "capExValue"]);
    },
    get maintenanceCostFocal() {
      return abs("maintenanceValue", [...propertyPath, "maintenanceValue"]);
    },
    get costOverrunFocal() {
      return abs("costOverrunValue", [...propertyPath, "costOverrunValue"]);
    },
    get sellingCostFocal() {
      return abs("sellingCostValue", [...propertyPath, "sellingCostValue"]);
    },
    get miscHoldingCostFocal() {
      return abs("miscHoldingCost", [...propertyPath, "miscHoldingCost"]);
    },
    get miscIncomeFocal() {
      return abs("miscRevenueValue", [...propertyPath, "miscRevenueValue"]);
    },
    get financingFocal() {
      return abs("financing", financingPath);
    },
    get loanFocal() {
      return abs("loan", loanPath);
    },
    get loanBaseFocal() {
      return abs("loanBaseValue", loanBasePath);
    },
    get purchaseLoanFocal() {
      return abs("purchaseLoanValue", [...loanBasePath, "purchaseLoanValue"]);
    },
    get repairLoanFocal() {
      return abs("repairLoanValue", [...loanBasePath, "repairLoanValue"]);
    },
    get arvLoanFocal() {
      return abs("arvLoanValue", [...loanBasePath, "arvLoanValue"]);
    },

    get closingCostFocal() {
      return abs("closingCostValue", [...loanPath, "closingCostValue"]);
    },
    get mgmtFocal() {
      return abs("mgmt", [...dealPath, "mgmt"]);
    },
    get mgmtBasePayFocal() {
      return abs("mgmtBasePayValue", [...mgmtPath, "mgmtBasePayValue"]);
    },
    get vacancyLossFocal() {
      return abs("vacancyLossValue", [...mgmtPath, "vacancyLossValue"]);
    },
  };
}
function makeDealSupplementFocals(basePath: ChildName[]) {
  const numVarbListPath: ChildName[] = [...basePath, "numVarbList"];
  return {
    get dealSystemFocal() {
      return abs("dealSystem", basePath);
    },
    get calculatedVarbsFocal() {
      return abs("calculatedVarbs", [...basePath, "calculatedVarbs"]);
    },
    get numVarbListMain() {
      return abs("numVarbList", numVarbListPath);
    },
    get numVarbItemMain() {
      return abs("numVarbItem", [...numVarbListPath, "numVarbItem"]);
    },
  };
}

function makeDealSystemFocals(systemPath: ChildName[]) {
  return {
    ...makeDealFocals([...systemPath, "deal"]),
    ...makeDealSupplementFocals([...systemPath]),
  };
}

const latentDealSystem = makeDealSystemFocals(["main", "latentDealSystem"]);

const activeDealPath: ChildName[] = ["main", "feStore", "dealMain"];
export const activeDealPathIdx = activeDealPath.length - 1;
const activeDealSystem = {
  ...makeDealFocals(activeDealPath),
  ...makeDealSupplementFocals(["main", "activeDealSystem"]),
};

const comparedDealSystemPath: ChildName[] = [
  "main",
  "dealCompareCache",
  "comparedDealSystem",
];
const comparedDealSystem = makeDealSystemFocals(comparedDealSystemPath);
const comparedDealSystemIdx = comparedDealSystemPath.length - 1;
const comparedDealPathIdx = comparedDealSystemIdx + 1;

type ValueToCheck = Record<
  string,
  Record<SectionPathName, AbsolutePathInfo<any>>
>;
const typeCheckContexts = <V extends ValueToCheck>(v: V) => v;
export const sectionPathContexts = typeCheckContexts({
  default: sectionPathContext(activeDealSystem),
  activeDealSystem: sectionPathContext(activeDealSystem),
  latentDealSystem: sectionPathContext(latentDealSystem),
  comparedDealSystem: sectionPathContext(comparedDealSystem),
});

// type IdxSpecifiers = Partial< Record<SectionName, Partial<Record<
// SectionPathContextName, number>>>>

type IdxSpecifiers = Partial<{
  [SN in SectionName]: Partial<{
    [CN in SectionPathContextName]: number;
  }>;
}>;
function checkIdxSpecifiers<T extends IdxSpecifiers>(idxSpecifiers: T): T {
  for (const contextName of Obj.keys(sectionPathContexts)) {
    const contexts = sectionPathContexts[contextName];
    for (const pathName of Obj.keys(contexts)) {
      const { path, sectionName } = contexts[pathName];
      if (Obj.isKey(idxSpecifiers, sectionName)) {
        const indexes: any = idxSpecifiers[sectionName];
        if (Obj.isKey(indexes, contextName)) {
          const idx = indexes[contextName];
          if (path.length - 1 !== idx) {
            throw new Error(
              `Problem with ${contextName} ${pathName} ${sectionName}`
            );
          }
        }
      }
    }
  }
  return idxSpecifiers;
}

export const indexesForSpecifiers = checkIdxSpecifiers({
  loan: {
    default: activeDealPathIdx + 2,
    activeDealSystem: activeDealPathIdx + 2,
    latentDealSystem: activeDealPathIdx + 2,
    comparedDealSystem: comparedDealPathIdx + 2,
  },
  deal: {
    default: activeDealPathIdx,
    activeDealSystem: activeDealPathIdx,
    // latentDealSystem: activeDealPathIdx, // this is probably not needed
    comparedDealSystem: comparedDealPathIdx,
  },
  dealSystem: {
    comparedDealSystem: comparedDealPathIdx - 1,
  },
});

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
