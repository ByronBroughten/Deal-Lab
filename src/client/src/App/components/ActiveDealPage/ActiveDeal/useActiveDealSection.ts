import { FeRouteName } from "../../../Constants/feRoutes";
import { VarbName } from "../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  completionStatuses,
  dealModes,
} from "../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterSectionOnlyOne } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useGoToPage } from "../../appWide/customHooks/useGoToPage";

export type ActiveDealSectionName = "property" | "financing" | "mgmt";
export function useActiveDealPage() {
  const main = useGetterSectionOnlyOne("main");
  const dealPage = main.onlyChild("activeDealPage");
  const deal = dealPage.onlyChild("deal");
  const calcVarbs = dealPage.onlyChild("calculatedVarbs");
  return {
    deal,
    calcVarbs,
  };
}

const completionStatusNames: Record<
  ActiveDealSectionName,
  VarbName<"calculatedVarbs">
> = {
  property: "propertyCompletionStatus",
  financing: "financingCompletionStatus",
  mgmt: "mgmtCompletionStatus",
};

export function useActiveDealCompletionStatus(
  sectionName: ActiveDealSectionName
) {
  const { calcVarbs } = useActiveDealPage();
  const varb = calcVarbs.varbNext(completionStatusNames[sectionName]);
  return varb.valueSafe(completionStatuses);
}

export const activeDealRouteNames: Record<ActiveDealSectionName, FeRouteName> =
  {
    property: "activeProperty",
    financing: "activeFinancing",
    mgmt: "activeMgmt",
  };

export function useActiveDealSection(sectionName: ActiveDealSectionName) {
  const { deal, calcVarbs } = useActiveDealPage();
  const completionStatusName = completionStatusNames[sectionName];
  const completionStatus = calcVarbs.valueNext(completionStatusName);
  const goToIndex = useGoToPage("activeDeal");
  return {
    feId: deal.onlyChildFeId(sectionName),
    dealMode: deal.varbNext("dealMode").valueSafe(dealModes),
    isComplete: completionStatus === "allValid",
    backBtnProps: {
      backToWhat: "Deal",
      onClick: goToIndex,
    },
  };
}
