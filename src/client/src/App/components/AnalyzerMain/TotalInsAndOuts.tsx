import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { InfoS } from "../../sharedWithServer/SectionsMeta/Info";
import LabeledOutputRowSimple from "../appWide/LabeledOutputRowSimple";
import { LabeledVarbSimple } from "../appWide/LabeledVarbSimple";
import ListGroupShell from "./general/ListGroupShell";
import GlobalInfoSection from "./general/StaticInfoSection";

export default function TotalInsAndOuts() {
  const { analyzer } = useAnalyzerContext();
  const { feInfo } = analyzer.singleSection("totalInsAndOuts");
  const varbInfo = InfoS.feVarbMaker(feInfo);
  return (
    <GlobalInfoSection>
      <LabeledOutputRowSimple>
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
      </LabeledOutputRowSimple>
    </GlobalInfoSection>
  );
}
