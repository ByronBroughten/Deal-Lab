import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MuiRow } from "../../../../general/MuiRow";
import { nativeTheme } from "./../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "./../../../../appWide/FormSectionLabeled";
import { CostOverrunValue } from "./CostOverrunValue";
import { RepairValue } from "./RepairValue";

type Props = { feId: string; dealMode: StateValue<"dealMode"> };
export function RehabSection({ feId, dealMode }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionLabeled {...{ label: "Rehab" }}>
      <MuiRow>
        <RepairValue
          sx={nativeTheme.editorMargins}
          feId={property.onlyChildFeId("repairValue")}
          dealMode={dealMode}
        />
        <CostOverrunValue
          feId={property.onlyChildFeId("costOverrunValue")}
          sx={nativeTheme.editorMargins}
        />
      </MuiRow>
    </FormSectionLabeled>
  );
}
