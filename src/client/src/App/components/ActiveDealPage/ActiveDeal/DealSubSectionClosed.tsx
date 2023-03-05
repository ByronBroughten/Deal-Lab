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

type Props = { sectionName: ActiveDealSectionName };

type SectionProps = {
  sectionTitle: string;
  displayName: string;
  detailVarbPropArr: LabeledVarbProps[];
};

function getPropertyProps(property: GetterSection<"property">): SectionProps {
  return {
    sectionTitle: "Property",
    displayName: property.valueNext("displayName").mainText,
    detailVarbPropArr: property.varbInfoArr([
      "targetRentYearly",
      "expensesYearly",
      "upfrontExpenses",
    ] as const),
  };
}

function getFinancingProps(
  financing: GetterSection<"financing">
): SectionProps {
  let displayName = "";
  const financingMode = financing.valueNext("financingMode");
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
    detailVarbPropArr: financing.varbInfoArr([
      "loanPaymentMonthly",
      "loanTotalDollars",
      // "downPayment"
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
  const section = deal.onlyChild(sectionName);
  if (section.isOfSectionName("property")) {
    return getPropertyProps(section);
  } else if (section.isOfSectionName("financing")) {
    return getFinancingProps(section);
  } else if (section.isOfSectionName("mgmt")) {
    return getMgmtProps(section);
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

export function DealSubSectionClosed({ sectionName }: Props) {
  const props = useProps(sectionName);
  const { completionStatus } = props;
  const isComplete = completionStatus === "allValid";
  return (
    <MainSubSectionClosed
      {...{
        titleRow: <DealSubSectionTitleRow {...props} />,
        detailsSection: isComplete && <DealSubSectionDetails {...props} />,
      }}
    />
  );
}
