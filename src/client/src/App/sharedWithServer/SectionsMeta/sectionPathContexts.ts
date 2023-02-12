import { AbsolutePathInfo } from "./SectionInfo/AbsolutePathInfo";
import { sectionAbsolutePathInfos } from "./sectionPathContexts/sectionAbsolutePathInfos";
import {
  SectionNameOfPath,
  SectionPathName,
} from "./sectionPathContexts/sectionPathNames";

const absolute = sectionAbsolutePathInfos;

const activeFocals = {
  calculatedVarbsFocal: absolute.calculatedVarbsActive,

  propertyFocal: absolute.propertyActive,
  unitFocal: absolute.unitActive,
  repairCostFocal: absolute.repairValueActive,
  utilityCostFocal: absolute.utilityCostValueActive,
  capExCostFocal: absolute.capExCostValueActive,
  maintenanceCostFocal: absolute.maintenanceCostValueActive,

  financingFocal: absolute.financingActive,
  loanFocal: absolute.loanActive,
  closingCostFocal: absolute.closingCostActive,

  mgmtFocal: absolute.mgmtActive,
  dealFocal: absolute.dealActive,
} as const;

export const sectionPathContexts = {
  get default() {
    return this.activeDealPage;
  },
  activeDealPage: sectionPathContext({
    ...activeFocals,
    userVarbListMain: absolute.userVarbListStored,
    userVarbItemMain: absolute.userVarbItemStored,
    ongoingListMain: absolute.ongoingListStored,
    ongoingItemMain: absolute.ongoingItemStored,
    singleTimeListMain: absolute.singleTimeListStored,
    singleTimeItemMain: absolute.singleTimeItemStored,
  }),
  userVarbEditorPage: sectionPathContext({
    ...activeFocals,
    userVarbListMain: absolute.userVarbListEditor,
    userVarbItemMain: absolute.userVarbItemEditor,
    ongoingListMain: absolute.ongoingListStored,
    ongoingItemMain: absolute.ongoingItemStored,
    singleTimeListMain: absolute.singleTimeListStored,
    singleTimeItemMain: absolute.singleTimeItemStored,
  }),
  userListEditorPage: sectionPathContext({
    ...activeFocals,
    userVarbListMain: absolute.userVarbListStored,
    userVarbItemMain: absolute.userVarbItemStored,
    ongoingListMain: absolute.ongoingListEditor,
    ongoingItemMain: absolute.ongoingItemEditor,
    singleTimeListMain: absolute.singleTimeListEditor,
    singleTimeItemMain: absolute.singleTimeItemEditor,
  }),
  latentSection: sectionPathContext({
    calculatedVarbsFocal: absolute.calculatedVarbsLatent,
    propertyFocal: absolute.propertyLatent,
    unitFocal: absolute.unitLatent,
    repairCostFocal: absolute.repairValueLatent,
    utilityCostFocal: absolute.utilityCostValueLatent,
    capExCostFocal: absolute.capExCostValueLatent,
    maintenanceCostFocal: absolute.maintenanceCostValueLatent,

    financingFocal: absolute.financingLatent,
    loanFocal: absolute.loanLatent,
    closingCostFocal: absolute.closingCostLatent,

    mgmtFocal: absolute.mgmtLatent,

    dealFocal: absolute.dealLatent,
    userVarbListMain: absolute.userVarbListLatent,
    userVarbItemMain: absolute.userVarbItemLatent,
    ongoingListMain: absolute.ongoingListLatent,
    ongoingItemMain: absolute.ongoingItemLatent,
    singleTimeListMain: absolute.singleTimeListLatent,
    singleTimeItemMain: absolute.singleTimeItemLatent,
  }),
} as const;

type SectionPathContexts = typeof sectionPathContexts;
export type SectionPathContextName = keyof SectionPathContexts;
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
