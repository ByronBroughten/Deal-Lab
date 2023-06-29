import { Box } from "@mui/material";
import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { LabeledVarbRow } from "../../../../../appWide/LabeledVarbRow";
import { TogglerBooleanVarb } from "../../../../../appWide/TogglerBooleanVarb";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { ClosingCostValue } from "./ClostingCostValue";
import { MortgageIns } from "./MortgageIns";

export function LoanTerms({ feId }: FeIdProp) {
  const feInfo = { sectionName: "loan", feId } as const;
  const loan = useGetterSection(feInfo);
  const isInterestOnlyVarb = loan.varbNext("isInterestOnly");

  const showLoanPayments =
    loan.valueNext("interestRatePercentPeriodicEditor").mainText &&
    loan.valueNext("loanTermSpanEditor").mainText;

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
    <FormSectionLabeled
      label={"Loan Terms"}
      className="BasicLoanInfo-otherInfo"
    >
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={loan.varbInfo("interestRatePercentPeriodicEditor")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={loan.varbInfo("loanTermSpanEditor")}
          label="Loan term"
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
        <MortgageIns feId={feId} />
        {showLoanPayments && (
          <LabeledVarbRow
            {...{
              sx: { marginTop: nativeTheme.s4 },
              varbPropArr: loan.varbInfoArr(...varbNames),
            }}
          />
        )}
        <ClosingCostValue
          {...{
            feId: loan.onlyChildFeId("closingCostValue"),
            fivePercentLoanDisplay: loan
              .varbNext("fivePercentBaseLoan")
              .displayVarb(),
          }}
        />
      </Box>
    </FormSectionLabeled>
  );
}
