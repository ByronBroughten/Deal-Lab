import { useGetterSection } from "../../../../../../../../modules/stateHooks/useGetterSection";
import { FeIdProp } from "../../../../../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { nativeTheme } from "../../../../../../../../theme/nativeTheme";
import { MuiRow } from "../../../../../../../general/MuiRow";
import { FormSectionLabeled } from "../../../../../../appWide/FormSectionLabeled";
import { CostOverrunValue } from "./ViewParts/CostOverrunValue";
import { MiscOnetimeValue } from "./ViewParts/MiscOnetimeValue";
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
        <MiscOnetimeValue
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
