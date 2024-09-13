import { Box, SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../../../../modules/stateHooks/useGetterSection";
import { FeSectionInfo } from "../../../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { VarbName } from "../../../../../../../../sharedWithServer/stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { StateValue } from "../../../../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue";
import {
  SectionNameByType,
  sectionNameS,
} from "../../../../../../../../sharedWithServer/stateSchemas/schema6SectionChildren/SectionNameByType";
import { Arr } from "../../../../../../../../sharedWithServer/utils/Arr";
import { nativeTheme } from "../../../../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../../../../appWide/FormSectionLabeled";
import { LabeledVarbRow } from "../../../../../../appWide/LabeledVarbRow";
import { MuiSelect, MuiSelectItems } from "../../../../../../appWide/MuiSelect";
import { LoanBaseCustom } from "./LoanBaseCustom";
import { LoanBaseExtra } from "./LoanBaseExtra";
import { LoanBaseSubValue } from "./LoanBaseSubValue";

export function LoanBaseValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "loanBaseValue", feId } as const;
  const baseValue = useGetterSection(feInfo);
  const valueSource = baseValue.valueNext("valueSourceName");
  return (
    <FormSectionLabeled
      {...{
        label: "Amount",
      }}
    >
      <Box
        sx={[
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            flexWrap: "wrap",
            mt: nativeTheme.editorMargins.my,
          },
        ]}
      >
        <LoanForWhatSelect
          {...{
            financingMode: baseValue.valueNext("financingMode"),
            feId,
            sx: { marginRight: nativeTheme.s3 },
          }}
        />
        <LoanBaseValueEditorArea
          {...{ feId, sx: { marginTop: nativeTheme.s3 } }}
        />
      </Box>
      {(sectionNameS.is(valueSource, "loanBaseSubValue") ||
        valueSource === "priceAndRepairValues") && (
        <LoanBaseExtra
          editorMargins={true}
          feId={baseValue.onlyChildFeId("loanBaseExtra")}
        />
      )}
      {sectionNameS.is(valueSource, "loanBaseSubValue") && (
        <ValueNumbers
          {...{
            sectionName: valueSource,
            feId: baseValue.onlyChildFeId(valueSource),
            sx: { mt: nativeTheme.s4 },
          }}
        />
      )}
    </FormSectionLabeled>
  );
}

interface ValueNumbersProps<SN extends SectionNameByType<"loanBaseSubValue">>
  extends FeSectionInfo<SN> {
  sx?: SxProps;
}
function ValueNumbers<SN extends SectionNameByType<"loanBaseSubValue">>({
  sectionName,
  feId,
  sx,
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
        sx,
        varbPropArr: [
          subValue.varbInfoArr(
            ...Arr.extractOrder(varbNames, ["offPercent", "offDollars"])
          ),
          subValue.varbInfoArr(
            ...Arr.extractOrder(varbNames, ["amountDollars", "amountPercent"])
          ),
        ],
      }}
    />
  ) : null;
}

function LoanForWhatSelect({
  feId,
  sx,
  financingMode,
}: {
  feId: string;
  sx?: SxProps;
  financingMode: StateValue<"financingMode">;
}) {
  const items: Record<
    StateValue<"financingMode">,
    MuiSelectItems<"loanBaseValueSource">
  > = {
    purchase: [
      ["purchaseLoanValue", "Property purchase"],
      ["repairLoanValue", "Upfront repairs"],
      ["priceAndRepairValues", "Purchase and repairs"],
      ["customAmountEditor", "Custom"],
    ],
    refinance: [
      ["arvLoanValue", "After repair value"],
      ["customAmountEditor", "Custom"],
    ],
  };

  const feInfo = { sectionName: "loanBaseValue", feId } as const;
  return (
    <MuiSelect
      {...{
        sx,
        label: "Loan for what",
        selectProps: {
          sx: [{ minWidth: 130 }],
        },
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        unionValueName: "loanBaseValueSource",
        items: items[financingMode],
      }}
    />
  );
}

function LoanBaseValueEditorArea({ feId, sx }: { feId: string; sx?: SxProps }) {
  const baseValue = useGetterSection({ sectionName: "loanBaseValue", feId });
  const valueSource = baseValue.valueNext("valueSourceName");

  return (
    <Box sx={sx}>
      <LoanBaseEditorAreaContent {...{ feId }} />
    </Box>
  );
}

function LoanBaseEditorAreaContent({ feId }: { feId: string }) {
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
        <LoanBaseCustom
          {...{
            feId: baseValue.onlyChildFeId("customLoanBase"),
            sx: { marginLeft: nativeTheme.s3 },
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
