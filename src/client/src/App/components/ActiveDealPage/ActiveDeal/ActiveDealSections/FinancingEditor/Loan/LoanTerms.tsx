import { Box } from "@mui/material";
import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { LabelWithInfo } from "../../../../../appWide/LabelWithInfo";
import { TogglerBooleanVarb } from "../../../../../appWide/TogglerBooleanVarb";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { ClosingCostValue } from "./ClostingCostValue";

export function LoanTerms({ feId }: FeIdProp) {
  const feInfo = { sectionName: "loan", feId } as const;
  const loan = useGetterSection(feInfo);
  const isInterestOnlyVarb = loan.varbNext("isInterestOnly");
  const hasMortInsVarb = loan.varbNext("hasMortgageIns");
  const hasMortIns = hasMortInsVarb.value("boolean");
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
        <TogglerBooleanVarb
          {...{
            feVarbInfo: hasMortInsVarb.feVarbInfo,
            label: (
              <LabelWithInfo
                {...{
                  label: "Mortgage insurance",
                  infoTitle: "Mortgage Insurance",
                  infoText: `Sometimes in order to get a loan you are required to pay for mortgage insurance. This tends to happen with loans where the borrower pays a low down payment—lower than 20%.\n\nMortgage insurance basically assures the bank that it will be able to recover its assets in the event that the borrower does not repay them, which makes it less risky for them to work with smaller down payments.\n\nYou may be required to pay the mortgage insurance in a lump sum at the time of closing, or as a recurring monthly payment, or both. To determine whether you'll need mortgage insurance and, if so, in what form and at what cost, either research the type of loan you're entering or ask your lender.`,
                }}
              />
            ),
            name: "Mortgage insurance toggle",
          }}
        />
        {hasMortIns && (
          <MuiRow
            sx={{
              "& .MuiInputBase-root": {
                minWidth: "135px",
              },
            }}
          >
            <NumObjEntityEditor
              sx={{
                marginRight: nativeTheme.editorMargins.mr,
              }}
              feVarbInfo={loan.varbInfo("mortgageInsUpfrontEditor")}
              label="Upfront"
            />
            <NumObjEntityEditor
              feVarbInfo={loan.varbInfo("mortgageInsPeriodicEditor")}
              label="Ongoing"
            />
          </MuiRow>
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
