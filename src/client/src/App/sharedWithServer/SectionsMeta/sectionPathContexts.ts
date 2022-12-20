import { SectionAbsolutePathInfo } from "./sectionPathContexts/sectionAbsolutePathInfo";
import { sectionAbsolutePathInfos } from "./sectionPathContexts/sectionAbsolutePathInfos";
import {
  SectionNameOfPath,
  SectionPathName,
} from "./sectionPathContexts/sectionPathNames";

const absolute = sectionAbsolutePathInfos;
export const sectionPathContexts = {
  default: sectionPathContext({
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
  userMainSectionStores: sectionPathContext({
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
  [PN in SectionPathName]: SectionAbsolutePathInfo<SectionNameOfPath<PN>>;
};
function sectionPathContext<T extends SectionPathContextGeneric>(context: T) {
  return context;
}

export function getSectionPathContext<SPCN extends SectionPathContextName>(
  contextName: SPCN
): SectionPathContext<SPCN> {
  return sectionPathContexts[contextName];
}
