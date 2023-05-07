import { StateValue } from "../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { MuiRow } from "../../../../../general/MuiRow";
import { CostOverrunValue } from "./ViewParts/CostOverrunValue";
import { MiscOnetimeCost } from "./ViewParts/MiscOnetimeCost";
import { RepairValue } from "./ViewParts/RepairValue";

type Props = { feId: string; dealMode: StateValue<"dealMode"> };
export function RehabSection({ feId, dealMode }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionLabeled label={"Rehab"}>
      <MuiRow>
        <RepairValue
          sx={nativeTheme.editorMargins}
          feId={property.onlyChildFeId("repairValue")}
          dealMode={dealMode}
        />
        <MiscOnetimeCost
          feId={property.onlyChildFeId("miscOnetimeCost")}
          menuDisplayNames={[
            "Property Inspection",
            "Sewer line Inspection",
            "Radon test",
          ]}
        />
        <CostOverrunValue
          feId={property.onlyChildFeId("costOverrunValue")}
          sx={nativeTheme.editorMargins}
        />
      </MuiRow>
    </FormSectionLabeled>
  );
}
