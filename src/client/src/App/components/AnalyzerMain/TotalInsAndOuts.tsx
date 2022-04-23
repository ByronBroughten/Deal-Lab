import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { Inf } from "../../sharedWithServer/SectionMetas/Info";
import LabeledOutputRow from "../appWide/LabeledOutputRow";
import { LabeledVarbSimple } from "../appWide/LabeledVarbSimple";
import ListGroupShell from "./general/ListGroupShell";
import GlobalInfoSection from "./general/StaticInfoSection";

export default function TotalInsAndOuts() {
  const { analyzer } = useAnalyzerContext();
  const { feInfo } = analyzer.singleSection("totalInsAndOuts");
  const varbInfo = Inf.feVarbMaker(feInfo);
  return (
    <GlobalInfoSection>
      <LabeledOutputRow>
        <ListGroupShell titleText="Upfront Totals">
          <LabeledVarbSimple
            feVarbInfo={varbInfo("upfrontRevenue")}
            displayLabel="Revenue"
          />
          <LabeledVarbSimple
            feVarbInfo={varbInfo("upfrontExpenses")}
            displayLabel="Expenses"
          />
        </ListGroupShell>
        <ListGroupShell titleText="Ongoing Totals">
          <LabeledVarbSimple
            feVarbInfo={varbInfo("revenueMonthly")}
            displayLabel="Revenue"
          />
          <LabeledVarbSimple
            feVarbInfo={varbInfo("expensesMonthly")}
            displayLabel="Expenses"
          />
        </ListGroupShell>
      </LabeledOutputRow>
    </GlobalInfoSection>
  );
}
