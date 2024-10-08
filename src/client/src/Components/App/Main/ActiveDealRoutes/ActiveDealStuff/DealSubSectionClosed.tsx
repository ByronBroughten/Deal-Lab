import { SxProps } from "@mui/material";
import { GetterSection } from "../../../../../sharedWithServer/StateGetters/GetterSection";
import { FeVarbInfo } from "../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { StateValue } from "../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue";
import { getFinancingTitle } from "../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/unionValues";
import { useGoToPage } from "../../../customHooks/useGoToPage";
import { DealSubSectionDetails } from "./DealSubSectionDetails";
import { DealSubSectionTitleRow } from "./DealSubSectionTitleRow";
import { MainSubSectionClosed } from "./MainSubSectionClosed";
import {
  ActiveDealChildName,
  activeDealRouteNames,
  useActiveDealCompletionStatus,
  useActiveDealPage,
} from "./useActiveDealSection";

type Props = { sx?: SxProps; childName: ActiveDealChildName };
export function DealSubSectionClosed({ childName, ...rest }: Props) {
  const props = useProps(childName);
  const { completionStatus } = props;
  const isComplete = completionStatus === "allValid";
  return (
    <MainSubSectionClosed
      {...{
        ...rest,
        titleRow: <DealSubSectionTitleRow {...props} />,
        detailsSection: isComplete && <DealSubSectionDetails {...props} />,
      }}
    />
  );
}

type SectionProps = {
  sectionTitle: string;
  displayName: string;
  detailVarbInfos: FeVarbInfo[];
};

const propsByDealMode = {
  property: {
    homeBuyer: {
      detailVarbNames: [
        "purchasePrice",
        "likability",
        "rehabCost",
        "expensesOngoingMonthly",
      ] as const,
    },
    buyAndHold: {
      detailVarbNames: [
        "purchasePrice",
        "rehabCost",
        "targetRentYearly",
        "expensesOngoingYearly",
      ] as const,
    },
    fixAndFlip: {
      detailVarbNames: [
        "purchasePrice",
        "afterRepairValue",
        "holdingPeriodMonths",
        // "grossProfit",
      ] as const,
    },
    brrrr: {
      detailVarbNames: [
        "purchasePrice",
        "rehabCost",
        "afterRepairValue",
        "holdingPeriodMonths",
        "targetRentYearly",
        "expensesOngoingYearly",
      ],
    },
  },
} as const;

function getPropertyProps(property: GetterSection<"property">): SectionProps {
  const mode = property.valueNext("propertyMode");
  return {
    sectionTitle: "Property",
    displayName: property.valueNext("displayName").mainText,
    detailVarbInfos: property.varbInfoArr(
      ...propsByDealMode.property[mode].detailVarbNames
    ),
  };
}

function getFinancingProps(
  financing: GetterSection<"financing">,
  dealMode: StateValue<"dealMode">
): SectionProps {
  let displayName = "";
  const financingMethod = financing.valueNext("financingMethod");

  if (financingMethod === "cashOnly") {
    displayName = "Cash Only";
  } else {
    const loans = financing.children("loan");
    for (let i = 0; i < loans.length; i++) {
      if (i !== 0) displayName += " | ";
      displayName += loans[i].valueNext("displayName").mainText;
    }
  }
  return {
    sectionTitle: getFinancingTitle(
      dealMode,
      financing.valueNext("financingMode")
    ),
    displayName,
    detailVarbInfos: financing.varbInfoArr(
      "loanTotalDollars",
      "loanPaymentMonthly",
      "loanUpfrontExpenses",
      "loanExpensesMonthly"
    ),
  };
}

function getMgmtProps(mgmt: GetterSection<"mgmt">): SectionProps {
  return {
    sectionTitle: "Management",
    displayName: mgmt.valueNext("displayName").mainText,
    detailVarbInfos: mgmt.varbInfoArr("expensesYearly"),
  };
}

function useSectionProps(childName: ActiveDealChildName): SectionProps {
  const { deal } = useActiveDealPage();
  switch (childName) {
    case "property": {
      return getPropertyProps(deal.onlyChild(childName));
    }
    case "mgmtOngoing": {
      return getMgmtProps(deal.onlyChild(childName));
    }
    case "purchaseFinancing":
    case "refiFinancing": {
      return getFinancingProps(
        deal.onlyChild(childName),
        deal.valueNext("dealMode")
      );
    }
  }
}

function useProps(sectionName: ActiveDealChildName): SectionProps & {
  openEditor: () => void;
  completionStatus: StateValue<"completionStatus">;
} {
  const sectionProps = useSectionProps(sectionName);
  const openEditor = useGoToPage(activeDealRouteNames[sectionName]);
  const completionStatus = useActiveDealCompletionStatus(sectionName);
  return {
    ...sectionProps,
    openEditor,
    completionStatus,
  };
}
