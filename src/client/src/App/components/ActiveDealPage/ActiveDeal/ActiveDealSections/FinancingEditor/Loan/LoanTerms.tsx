import { Box } from "@mui/material";
import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { TogglerBooleanVarb } from "../../../../../appWide/TogglerBooleanVarb";
import { VarbLabel } from "../../../../../appWide/VarbLabel";
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
            label: <VarbLabel names={loan.varbInfoNext("hasMortgageIns")} />,
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
