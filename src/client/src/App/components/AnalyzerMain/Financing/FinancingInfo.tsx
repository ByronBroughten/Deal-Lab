import styled from "styled-components";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { Inf } from "../../../sharedWithServer/SectionMetas/Info";
import theme from "../../../theme/Theme";
import useHowMany from "../../appWide/customHooks/useHowMany";
import LabeledOutputRow from "../../appWide/LabeledOutputRow";
import { LabeledVarbSimple } from "../../appWide/LabeledVarbSimple";
import GlobalInfoSection from "../general/StaticInfoSection";

export default function FinancingInfo() {
  const { analyzer } = useAnalyzerContext();
  const financing = analyzer.singleSection("financing");

  const downPaymentDollars = financing.value(
    "downPaymentDollars",
    "numObj"
  ).number;
  const downPaymentIsPercentable = ![0, "?"].includes(downPaymentDollars);

  const loanIds = financing.childFeIds("loan");
  const { isAtLeastOne, areMultiple } = useHowMany(loanIds);
  const varbInfo = Inf.feVarbMaker(financing.feInfo);
  return (
    <Styled className="FinancingInfo-root">
      <LabeledOutputRow>
        {isAtLeastOne && (
          <>
            <LabeledVarbSimple
              themeSectionName="loan"
              feVarbInfo={varbInfo("downPaymentDollars")}
              parenthInfo={
                downPaymentIsPercentable
                  ? varbInfo("downPaymentPercent")
                  : undefined
              }
            />
            <LabeledVarbSimple
              themeSectionName="loan"
              feVarbInfo={varbInfo("pitiMonthly")}
            />
          </>
        )}
        {areMultiple && (
          <LabeledVarbSimple
            themeSectionName="loan"
            feVarbInfo={varbInfo("loanAmountDollarsTotal")}
          />
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
