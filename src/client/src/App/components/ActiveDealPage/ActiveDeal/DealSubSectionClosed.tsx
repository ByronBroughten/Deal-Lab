import { SxProps } from "@mui/material";
import { StateValue } from "../../../sharedWithServer/SectionsMeta/values/StateValue";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { useGoToPage } from "../../appWide/customHooks/useGoToPage";
import { LabeledVarbProps } from "../../appWide/LabeledVarb";
import { DealSubSectionDetails } from "./DealSubSectionDetails";
import { DealSubSectionTitleRow } from "./DealSubSectionTitleRow";
import { MainSubSectionClosed } from "./MainSubSectionClosed";
import {
  activeDealRouteNames,
  ActiveDealSectionName,
  useActiveDealCompletionStatus,
  useActiveDealPage,
} from "./useActiveDealSection";

type Props = { sx?: SxProps; sectionName: ActiveDealSectionName };
export function DealSubSectionClosed({ sectionName, ...rest }: Props) {
  const props = useProps(sectionName);
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
  detailVarbPropArr: LabeledVarbProps[];
};

const propsByDealMode = {
  property: {
    buyAndHold: {
      detailVarbNames: [
        "purchasePrice",
        "rehabCost",
        "targetRentYearly",
        "expensesYearly",
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
  },
} as const;

function getPropertyProps(property: GetterSection<"property">): SectionProps {
  const mode = property.valueNext("propertyMode");
  return {
    sectionTitle: "Property",
    displayName: property.valueNext("displayName").mainText,
    detailVarbPropArr: property.varbInfoArr(
      propsByDealMode.property[mode].detailVarbNames
    ),
  };
}

function getFinancingProps(
  financing: GetterSection<"financing">
): SectionProps {
  let displayName = "";
  const financingMode = financing.valueNext("financingMode");
  const { calculatedFocal } = financing;

  if (financingMode === "cashOnly") {
    displayName = "Cash Only";
  } else {
    const loans = financing.children("loan");
    for (let i = 0; i < loans.length; i++) {
      if (i !== 0) displayName += " | ";
      displayName += loans[i].valueNext("displayName").mainText;
    }
  }
  return {
    sectionTitle: "Financing",
    displayName,
    detailVarbPropArr: calculatedFocal.varbInfoArr([
      "downPaymentDollars",
      "loanTotalDollars",
      "loanPaymentMonthly",
      "loanUpfrontExpenses",
      "loanExpensesYearly",
    ] as const),
  };
}

function getMgmtProps(mgmt: GetterSection<"mgmt">): SectionProps {
  return {
    sectionTitle: "Management",
    displayName: mgmt.valueNext("displayName").mainText,
    detailVarbPropArr: mgmt.varbInfoArr(["expensesYearly"] as const),
  };
}

function useSectionProps(sectionName: ActiveDealSectionName) {
  const { deal } = useActiveDealPage();
  if (sectionName === "property") {
    const dealMode = deal.valueNext("dealMode");
    return getPropertyProps(deal.onlyChild("property"));
  } else if (sectionName === "financing") {
    return getFinancingProps(deal.onlyChild("financing"));
  } else if (sectionName === "mgmt") {
    return getMgmtProps(deal.onlyChild("mgmt"));
  } else throw new Error(`Invalid sectionName: ${sectionName}`);
}

function useProps(sectionName: ActiveDealSectionName): SectionProps & {
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
