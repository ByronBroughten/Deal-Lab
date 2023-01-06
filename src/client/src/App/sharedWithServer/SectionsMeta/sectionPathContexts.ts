import { AbsolutePathInfo } from "./SectionInfo/AbsolutePathInfo";
import { sectionAbsolutePathInfos } from "./sectionPathContexts/sectionAbsolutePathInfos";
import {
  SectionNameOfPath,
  SectionPathName,
} from "./sectionPathContexts/sectionPathNames";

const absolute = sectionAbsolutePathInfos;
export const sectionPathContexts = {
  default: sectionPathContext({
    calculatedVarbsFocal: absolute.calculatedVarbsActive,
    propertyFocal: absolute.propertyActive,
    dealFocal: absolute.dealActive,
    propertyGeneralFocal: absolute.propertyGeneralActive,
    financingFocal: absolute.financingActive,
    mgmtGeneralFocal: absolute.mgmtGeneralActive,
    userVarbItemMain: absolute.userVarbItemStored,
    ongoingListMain: absolute.ongoingListStored,
    ongoingItemMain: absolute.ongoingItemStored,
    singleTimeListMain: absolute.singleTimeListStored,
    singleTimeItemMain: absolute.singleTimeItemStored,
  }),
  activeDealPage: sectionPathContext({
    calculatedVarbsFocal: absolute.calculatedVarbsActive,
    propertyFocal: absolute.propertyActive,
    dealFocal: absolute.dealActive,
    propertyGeneralFocal: absolute.propertyGeneralActive,
    financingFocal: absolute.financingActive,
    mgmtGeneralFocal: absolute.mgmtGeneralActive,
    userVarbItemMain: absolute.userVarbItemStored,
    ongoingListMain: absolute.ongoingListStored,
    ongoingItemMain: absolute.ongoingItemStored,
    singleTimeListMain: absolute.singleTimeListStored,
    singleTimeItemMain: absolute.singleTimeItemStored,
  }),
  userVarbEditorPage: sectionPathContext({
    calculatedVarbsFocal: absolute.calculatedVarbsActive,
    propertyFocal: absolute.propertyActive,
    dealFocal: absolute.dealActive,
    propertyGeneralFocal: absolute.propertyGeneralActive,
    financingFocal: absolute.financingActive,
    mgmtGeneralFocal: absolute.mgmtGeneralActive,
    userVarbItemMain: absolute.userVarbItemEditor,
    ongoingListMain: absolute.ongoingListStored,
    ongoingItemMain: absolute.ongoingItemStored,
    singleTimeListMain: absolute.singleTimeListStored,
    singleTimeItemMain: absolute.singleTimeItemStored,
  }),
  userListEditorPage: sectionPathContext({
    calculatedVarbsFocal: absolute.calculatedVarbsActive,
    propertyFocal: absolute.propertyActive,
    dealFocal: absolute.dealActive,
    propertyGeneralFocal: absolute.propertyGeneralActive,
    financingFocal: absolute.financingActive,
    mgmtGeneralFocal: absolute.mgmtGeneralActive,
    userVarbItemMain: absolute.userVarbItemStored,
    ongoingListMain: absolute.ongoingListEditor,
    ongoingItemMain: absolute.ongoingItemEditor,
    singleTimeListMain: absolute.singleTimeListEditor,
    singleTimeItemMain: absolute.singleTimeItemEditor,
  }),
  latentSection: sectionPathContext({
    calculatedVarbsFocal: absolute.calculatedVarbsLatent,
    propertyFocal: absolute.propertyLatent,
    dealFocal: absolute.dealLatent,
    propertyGeneralFocal: absolute.propertyGeneralLatent,
    financingFocal: absolute.financingLatent,
    mgmtGeneralFocal: absolute.mgmtGeneralLatent,

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
