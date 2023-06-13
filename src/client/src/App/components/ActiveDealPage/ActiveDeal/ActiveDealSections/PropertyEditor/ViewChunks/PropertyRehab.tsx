import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { MuiRow } from "../../../../../general/MuiRow";
import { CostOverrunValue } from "./ViewParts/CostOverrunValue";
import { MiscOnetimeCost } from "./ViewParts/MiscOnetimeCost";
import { RepairValue } from "./ViewParts/RepairValue";

export function RehabSection({ feId }: FeIdProp) {
  const property = useGetterSection({ sectionName: "property", feId });

  const repair = property.onlyChild("repairValue");
  const repairSource = repair.valueNext("valueSourceName");
  return (
    <FormSectionLabeled label={"Rehab"}>
      <MuiRow>
        <RepairValue
          sx={nativeTheme.editorMargins}
          feId={repair.feId}
          dealMode={property.valueNext("propertyMode")}
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
