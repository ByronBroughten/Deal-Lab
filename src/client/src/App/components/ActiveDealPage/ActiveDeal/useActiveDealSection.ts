import { FeRouteName } from "../../../Constants/feRoutes";
import { dealPropertiesByType } from "../../../sharedWithServer/defaultMaker/makeDefaultDeal";
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
  const dealMode = deal.valueNext("dealMode");
  return {
    dealMode,
    feId: deal.onlyChildFeId(dealChildName(dealMode, sectionName)),
    isComplete: completionStatus === "allValid",
    backBtnProps: {
      backToWhat: "Deal",
      onClick: goToIndex,
    },
  };
}

function dealChildName(
  dealMode: StateValue<"dealMode">,
  sectionName: ActiveDealSectionName
) {
  if (sectionName === "property") {
    return dealPropertiesByType[dealMode];
  } else {
    return sectionName;
  }
}
