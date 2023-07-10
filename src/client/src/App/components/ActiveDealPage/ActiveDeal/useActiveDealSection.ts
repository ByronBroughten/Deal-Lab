import { FeRouteName } from "../../../Constants/feRoutes";
import { ChildName } from "../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { StateValue } from "../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSectionOnlyOne } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { StrictExtract } from "../../../sharedWithServer/utils/types";
import { useGoToPage } from "../../customHooks/useGoToPage";

export type ActiveDealChildName = StrictExtract<
  ChildName<"deal">,
  "property" | "purchaseFinancing" | "refiFinancing" | "mgmtOngoing"
>;
export function useActiveDealPage() {
  const main = useGetterSectionOnlyOne("main");
  const feStore = main.onlyChild("feStore");

  const deal = main.sections.getActiveDeal();
  const system = main.onlyChild("activeDealSystem");
  const calcVarbs = system.onlyChild("calculatedVarbs");
  return {
    deal,
    calcVarbs,
    feStore,
  };
}

export function useActiveDealCompletionStatus(
  childName: ActiveDealChildName
): StateValue<"completionStatus"> {
  const { deal } = useActiveDealPage();
  return deal.onlyChild(childName).valueNext("completionStatus");
}

export const activeDealRouteNames: Record<ActiveDealChildName, FeRouteName> = {
  property: "activeProperty",
  purchaseFinancing: "activePurchaseFi",
  refiFinancing: "activeRefi",
  mgmtOngoing: "activeMgmt",
};

export function useActiveDealSection(sectionName: ActiveDealChildName) {
  const { deal } = useActiveDealPage();
  const completionStatus = useActiveDealCompletionStatus(sectionName);
  const goToIndex = useGoToPage("activeDeal");
  const dealMode = deal.valueNext("dealMode");
  return {
    dealMode,
    feId: deal.onlyChildFeId(sectionName),
    isComplete: completionStatus === "allValid",
    backBtnProps: {
      backToWhat: "Deal",
      onClick: goToIndex,
    },
  };
}
