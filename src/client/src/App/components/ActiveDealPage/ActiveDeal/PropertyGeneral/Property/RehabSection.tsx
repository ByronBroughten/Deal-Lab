import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MuiRow } from "../../../../general/MuiRow";
import { nativeTheme } from "./../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "./../../../../appWide/FormSectionLabeled";
import { CostOverrunValue } from "./CostOverrunValue";
import { RepairValue } from "./RepairValue";

type Props = { feId: string };
export function RehabSection({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionLabeled {...{ label: "Rehab" }}>
      <MuiRow>
        <RepairValue
          sx={nativeTheme.editorMargins}
          feId={property.onlyChildFeId("repairValue")}
        />
        <CostOverrunValue
          feId={property.onlyChildFeId("costOverrunValue")}
          sx={nativeTheme.editorMargins}
        />
        {/* <SectionToggler
          {...{
            sx: { mt: nativeTheme.s3 },
            labelProps: { sx: { fontSize: nativeTheme.fs17 } },
            labelText: "Custom rehab costs",
            feVarbInfo: property.varbInfoNext("useCustomOneTimeCosts"),
          }}
        >
          <ChildValuesOneTime
            {...{
              sectionName: "singleTimeValueGroup",
              feId: property.onlyChildFeId("upfrontExpenseGroup"),
            }}
          />
        </SectionToggler> */}
      </MuiRow>
    </FormSectionLabeled>
  );
}
