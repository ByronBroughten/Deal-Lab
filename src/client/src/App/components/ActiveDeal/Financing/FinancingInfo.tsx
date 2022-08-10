import styled from "styled-components";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../theme/Theme";
import useHowMany from "../../appWide/customHooks/useHowMany";
import LabeledOutputRowSimple from "../../appWide/LabeledOutputRowSimple";
import { LabeledVarbSimpleNext } from "../../appWide/LabeledVarbSimple";
import GlobalInfoSection from "../general/StaticInfoSection";

export default function FinancingInfo({ feId }: { feId: string }) {
  const financing = useGetterSection({
    sectionName: "financing",
    feId,
  });
  const downPaymentDollars =
    financing.varb("downPaymentDollars").numberOrQuestionMark;
  const downPaymentIsPercentable = ![0, "?"].includes(downPaymentDollars);
  const loanIds = financing.childFeIds("loan");
  const { isAtLeastOne, areMultiple } = useHowMany(loanIds);
  return (
    <Styled className="FinancingInfo-root">
      <LabeledOutputRowSimple>
        {
          <>
            <LabeledVarbSimpleNext
              themeName="loan"
              feVarbInfo={financing.varbInfo("downPaymentDollars")}
              parenthInfo={
                downPaymentIsPercentable
                  ? financing.varbInfo("downPaymentPercent")
                  : undefined
              }
            />
            <LabeledVarbSimpleNext
              themeName="loan"
              feVarbInfo={financing.varbInfo("pitiMonthly")}
            />
            <LabeledVarbSimpleNext
              themeName="loan"
              feVarbInfo={financing.varbInfo("pitiYearly")}
            />
          </>
        }
        {areMultiple && (
          <LabeledVarbSimpleNext
            themeName="loan"
            feVarbInfo={financing.varbInfo("loanTotalDollars")}
          />
        )}
      </LabeledOutputRowSimple>
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
