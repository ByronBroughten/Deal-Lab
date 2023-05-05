import { Box } from "@mui/material";
import { VarbName } from "../../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { FeSectionInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import {
  SectionNameByType,
  sectionNameS,
} from "../../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { StateValue } from "../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { LabeledVarbRow } from "../../../../../appWide/LabeledVarbRow";
import { MuiSelect } from "../../../../../appWide/MuiSelect";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { LoanBaseSubValue } from "./LoanBaseSubValue";

export function LoanBaseValueNext({ feId }: { feId: string }) {
  const feInfo = { sectionName: "loanBaseValue", feId } as const;
  const baseValue = useGetterSection(feInfo);
  const valueSource = baseValue.valueNext("valueSourceName");
  return (
    <FormSectionLabeled
      {...{
        label: "Loan Amount",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
      >
        <MuiSelect
          {...{
            label: "Pay for what",
            sx: { minWidth: "110px" },
            feVarbInfo: {
              ...feInfo,
              varbName: "valueSourceName",
            },
            unionValueName: "loanBaseValueSource",
            items: [
              ["purchaseLoanValue", "Property purchase"],
              ["repairLoanValue", "Upfront repairs"],
              ["priceAndRepairValues", "Purchase and repairs"],
              ["customAmountEditor", "Custom"],
            ],
          }}
        />
        <Box sx={{ ml: nativeTheme.s3 }}>
          <LoanBaseValueEditorArea {...{ feId }} />
        </Box>
      </Box>
      {sectionNameS.is(valueSource, "loanBaseSubValue") && (
        <ValueNumbers
          {...{
            sectionName: valueSource,
            feId: baseValue.onlyChildFeId(valueSource),
          }}
        />
      )}
    </FormSectionLabeled>
  );
}

interface ValueNumbersProps<SN extends SectionNameByType<"loanBaseSubValue">>
  extends FeSectionInfo<SN> {}
function ValueNumbers<SN extends SectionNameByType<"loanBaseSubValue">>({
  sectionName,
  feId,
}: ValueNumbersProps<SN>) {
  const subValue = useGetterSection({
    sectionName,
    feId,
  });
  const valueSourceName = subValue.valueNext("valueSourceName");
  const sourceToDisplayName: Record<
    StateValue<"percentDollarsSource">,
    VarbName<SectionNameByType<"loanBaseSubValue">>
  > = {
    amountDollarsEditor: "amountDollars",
    amountPercentEditor: "amountPercent",
    offDollarsEditor: "offDollars",
    offPercentEditor: "offPercent",
  };

  const editorText = subValue.valueNext(valueSourceName).mainText;
  const varbNames = (
    ["offPercent", "offDollars", "amountPercent", "amountDollars"] as const
  ).filter((varbName) => varbName !== sourceToDisplayName[valueSourceName]);

  return editorText ? (
    <LabeledVarbRow
      {...{
        sx: { mt: nativeTheme.s2 },
        varbPropArr: subValue.varbInfoArr(varbNames),
      }}
    />
  ) : null;
}

function LoanBaseValueEditorArea({ feId }: { feId: string }) {
  const baseValue = useGetterSection({ sectionName: "loanBaseValue", feId });
  const valueSource = baseValue.valueNext("valueSourceName");
  switch (valueSource) {
    case "priceAndRepairValues": {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LoanBaseSubValue
            {...{
              label: "Purchase price",
              sectionName: "purchaseLoanValue",
              feId: baseValue.onlyChildFeId("purchaseLoanValue"),
            }}
          />
          <LoanBaseSubValue
            {...{
              label: "Repair costs",
              sectionName: "repairLoanValue",
              feId: baseValue.onlyChildFeId("repairLoanValue"),
              sx: { ml: nativeTheme.s3 },
            }}
          />
        </Box>
      );
    }
    case "customAmountEditor": {
      return (
        <NumObjEntityEditor
          {...{
            feVarbInfo: baseValue.varbInfo("valueDollarsEditor"),
            labeled: false,
            sx: {
              "& .MaterialDraftEditor-wrapper": {},
              "& .MuiInputBase-root": {
                minWidth: 80,
                pt: "8px",
                pb: "4px",
              },
            },
          }}
        />
      );
    }
    default: {
      return (
        <LoanBaseSubValue
          {...{
            sectionName: valueSource,
            feId: baseValue.onlyChildFeId(valueSource),
          }}
        />
      );
    }
  }
}
