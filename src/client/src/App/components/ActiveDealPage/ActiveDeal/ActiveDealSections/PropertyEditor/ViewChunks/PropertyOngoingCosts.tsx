import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { CapExValue } from "./ViewParts/CapExValue";
import { MaintenanceValue } from "./ViewParts/MaintenanceValue";
import { MiscOngoingCost } from "./ViewParts/MiscOngoingCost";
import { UtilityValue } from "./ViewParts/UtilityValue";

export function PropertyOngoingCosts({ feId }: FeIdProp) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionLabeled label="Ongoing Costs">
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("taxesOngoingEditor")}
        />
        <NumObjEntityEditor
          inputMargins
          editorType="equation"
          feVarbInfo={property.varbInfo("homeInsOngoingEditor")}
          quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
        />
        <UtilityValue
          propertyMode={property.valueNext("propertyMode")}
          feId={property.onlyChildFeId("utilityOngoing")}
        />
        <CapExValue feId={property.onlyChildFeId("capExValue")} />
        <MaintenanceValue feId={property.onlyChildFeId("maintenanceValue")} />
        <MiscOngoingCost
          feId={property.onlyChildFeId("miscOngoingCost")}
          menuDisplayNames={["HOA Fees", "Landscaping", "Accounting", "Legal"]}
        />
      </MuiRow>
    </FormSectionLabeled>
  );
}
