import { FeRouteName } from "../../../Constants/feRoutes";
import { ChildName } from "../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { StateValue } from "../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useSetterMain } from "../../../sharedWithServer/stateClassHooks/useMain";
import { StrictExtract } from "../../../sharedWithServer/utils/types";
import { useGoToPage } from "../../customHooks/useGoToPage";

export type ActiveDealChildName = StrictExtract<
  ChildName<"deal">,
  "property" | "purchaseFinancing" | "refiFinancing" | "mgmt"
>;
export function useActiveDealPage() {
  const main = useSetterMain();
  const feStore = main.get.onlyChild("feStore");

  const deal = main.sections.getActiveDeal().get;
  const system = main.get.onlyChild("activeDealSystem");
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
  mgmt: "activeMgmt",
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
