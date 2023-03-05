import { FeRouteName } from "../../../Constants/feRoutes";
import { StateValue } from "../../../sharedWithServer/SectionsMeta/values/StateValue";
import { dealModes } from "../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
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

const completionStatusNames = {
  property: "propertyCompletionStatus",
  financing: "financingCompletionStatus",
  mgmt: "mgmtCompletionStatus",
} as const;

export function useActiveDealCompletionStatus(
  sectionName: ActiveDealSectionName
): StateValue<"completionStatus"> {
  const { calcVarbs } = useActiveDealPage();
  return calcVarbs.valueNext(completionStatusNames[sectionName]);
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
