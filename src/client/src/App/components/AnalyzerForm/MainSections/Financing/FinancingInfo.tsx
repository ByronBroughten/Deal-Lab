import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import GlobalInfoSection from "../general/StaticInfoSection";
import styled from "styled-components";
import theme from "../../../../theme/Theme";
import useHowMany from "../../../appWide/customHooks/useHowMany";
import LabeledOutputRow from "../../../appWide/LabeledOutputRow";
import { LabeledVarbSimple } from "../../../appWide/LabeledVarbSimple";
import { Inf } from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";

export default function FinancingInfo() {
  const { analyzer } = useAnalyzerContext();
  const financing = analyzer.singleSection("financing");
  const loanIds = financing.childFeIds("loan");
  const { isAtLeastOne, areMultiple } = useHowMany(loanIds);
  const varbInfo = Inf.feVarbMaker(financing.feInfo);
  return (
    <Styled className="FinancingInfo-root">
      <LabeledOutputRow>
        <LabeledVarbSimple
          feVarbInfo={varbInfo("downPaymentDollars")}
          parenthInfo={varbInfo("downPaymentPercent")}
        />
        {isAtLeastOne && (
          <LabeledVarbSimple feVarbInfo={varbInfo("pitiMonthly")} />
        )}
        {areMultiple && (
          <LabeledVarbSimple feVarbInfo={varbInfo("loanAmountDollarsTotal")} />
        )}
      </LabeledOutputRow>
    </Styled>
  );
}

const Styled = styled(GlobalInfoSection)`
  background-color: ${theme.loan.light};
  padding: ${theme.s2} ${theme.s3} ${theme.s2} ${theme.s3};
  display: flex;

  .FinancingInfo-viewable {
    display: flex;
  }
  .Space-item {
    padding: ${theme.s2};
  }
  .LabeledVarb-output {
    border-color: ${theme.loan.border};
  }
  .LabeledVarb-label {
    background: ${theme.loan.light};
  }
`;
