import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import LabeledOutputRow from "../../appWide/LabeledOutputRow";
import GlobalInfoSection from "./general/StaticInfoSection";
import { LabeledVarbSimple } from "../../appWide/LabeledVarbSimple";
import ListGroupShell from "./general/ListGroupShell";
import { Inf } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";

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
