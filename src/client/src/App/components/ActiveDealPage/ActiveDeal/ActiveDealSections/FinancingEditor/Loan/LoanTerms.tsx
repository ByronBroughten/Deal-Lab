import { Box } from "@mui/material";
import { FeIdProp } from "../../../../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { useGetterSection } from "../../../../../../stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSectionNext } from "../../../../../appWide/FormSectionNext";
import { LabeledVarbRow } from "../../../../../appWide/LabeledVarbRow";
import { TogglerBooleanVarb } from "../../../../../appWide/TogglerBooleanVarb";
import { MuiRow } from "../../../../../general/MuiRow";
import { PeriodicEditor } from "./../../../../../inputs/PeriodicEditor";
import { TimespanEditor } from "./../../../../../inputs/TimespanEditor";
import { MortgageIns } from "./MortgageIns";

export function LoanTerms({ feId }: FeIdProp) {
  const feInfo = { sectionName: "loan", feId } as const;
  const loan = useGetterSection(feInfo);
  const isInterestOnlyVarb = loan.varbNext("isInterestOnly");

  const loanTerm = loan.onlyChild("loanTermEditor");
  const interestRate = loan.onlyChild("interestRateEditor");

  const showLoanPayments =
    loanTerm.valueNext("valueEditor").mainText &&
    interestRate.valueNext("valueEditor").mainText;

  const showLoanExpenses =
    showLoanPayments &&
    loan.varbNext("expensesMonthly").displayValue !==
      loan.varbNext("loanPaymentMonthly").displayValue;

  const varbNames: ("loanPaymentMonthly" | "expensesMonthly")[] = [
    "loanPaymentMonthly",
  ];

  if (showLoanExpenses) {
    varbNames.push("expensesMonthly");
  }

  return (
    <FormSectionNext label={"Parameters"}>
      <MuiRow>
        <PeriodicEditor
          feId={interestRate.feId}
          labelInfo={loan.periodicVBI("interestRatePercent")}
          inputMargins
        />
        <TimespanEditor
          feId={loanTerm.feId}
          labelInfo={loan.timespanVBI("loanTerm")}
          inputMargins
        />
      </MuiRow>
      <Box sx={{ pb: nativeTheme.s3 }}>
        <TogglerBooleanVarb
          {...{
            feVarbInfo: isInterestOnlyVarb.feVarbInfo,
            label: "Interest only payments",
            name: "interest only toggle",
          }}
        />
        <MortgageIns feId={feId} editorMargins={true} />
        {showLoanPayments && (
          <LabeledVarbRow
            {...{
              sx: { marginTop: nativeTheme.s4 },
              varbPropArr: loan.varbInfoArr(...varbNames),
            }}
          />
        )}
      </Box>
    </FormSectionNext>
  );
}
