import { FeRouteName } from "../../../Constants/feRoutes";
import { StateValue } from "../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useSetterMain } from "../../../sharedWithServer/stateClassHooks/useMain";
import { useGoToPage } from "../../appWide/customHooks/useGoToPage";

export type ActiveDealSectionName = "property" | "financing" | "mgmt";
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

const completionStatusNames = {
  property: "propertyCompletionStatus",
  financing: "financingCompletionStatus",
  mgmt: "mgmtCompletionStatus",
} as const;

export function useActiveDealCompletionStatus(
  sectionName: ActiveDealSectionName
): StateValue<"completionStatus"> {
  const { calcVarbs, deal } = useActiveDealPage();
  if (sectionName === "property") {
    return deal.onlyChild("property").valueNext("completionStatus");
  } else {
    return calcVarbs.valueNext(completionStatusNames[sectionName]);
  }
}

export const activeDealRouteNames: Record<ActiveDealSectionName, FeRouteName> =
  {
    property: "activeProperty",
    financing: "activeFinancing",
    mgmt: "activeMgmt",
  };

export function useActiveDealSection(sectionName: ActiveDealSectionName) {
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
