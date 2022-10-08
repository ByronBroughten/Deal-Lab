import styled from "styled-components";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../theme/Theme";
import useHowMany from "../../appWide/customHooks/useHowMany";
import LabeledVarbRow from "../../appWide/LabeledVarbRow";
import { LabeledVarbSimple } from "../../appWide/LabeledVarbSimple";
import GlobalInfoSection from "../general/StaticInfoSection";

export default function FinancingInfo({ feId }: { feId: string }) {
  const financing = useGetterSection({
    sectionName: "financing",
    feId,
  });

  const deal = useGetterSection({
    sectionName: "deal",
    feId: financing.parent.feId,
  });

  const downPaymentDollars =
    deal.varb("downPaymentDollars").numberOrQuestionMark;
  const downPaymentIsPercentable = ![0, "?"].includes(downPaymentDollars);
  const loanIds = financing.childFeIds("loan");
  const { isAtLeastOne, areMultiple } = useHowMany(loanIds);
  return (
    <Styled className="FinancingInfo-root">
      <LabeledVarbRow themeName="loan">
        {
          <>
            <LabeledVarbSimple
              themeName="loan"
              feVarbInfo={deal.varbInfo("downPaymentDollars")}
              parenthInfo={
                downPaymentIsPercentable
                  ? deal.varbInfo("downPaymentPercent")
                  : undefined
              }
            />
            {isAtLeastOne && (
              <LabeledVarbSimple
                themeName="loan"
                feVarbInfo={financing.varbInfo("loanPaymentMonthly")}
              />
            )}
            <LabeledVarbSimple
              themeName="loan"
              feVarbInfo={deal.varbInfo("pitiMonthly")}
            />
          </>
        }
        {areMultiple && (
          <LabeledVarbSimple
            themeName="loan"
            feVarbInfo={financing.varbInfo("loanTotalDollars")}
          />
        )}
      </LabeledVarbRow>
    </Styled>
  );
}

const Styled = styled(GlobalInfoSection)`
  background-color: ${theme.loan.light};
  padding: ${theme.s2} ${theme.s3} ${theme.s3} ${theme.s3};
  display: flex;

  .LabeledVarb-output {
    border-color: ${theme.loan.border};
  }
  .LabeledVarb-label {
    background: ${theme.loan.light};
  }
`;
