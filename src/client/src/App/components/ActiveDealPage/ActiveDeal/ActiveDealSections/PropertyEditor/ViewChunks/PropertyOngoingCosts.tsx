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

  const taxes = property.onlyChild("taxesOngoing");
  const homeIns = property.onlyChild("homeInsOngoing");
  return (
    <FormSectionLabeled label="Ongoing Costs">
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={taxes.varbInfo("valueDollarsPeriodicEditor")}
        />
        <NumObjEntityEditor
          inputMargins
          editorType="equation"
          feVarbInfo={homeIns.varbInfo("valueDollarsPeriodicEditor")}
          quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
        />
        <UtilityValue
          propertyMode={property.valueNext("propertyMode")}
          feId={property.onlyChildFeId("utilityOngoing")}
        />
        <CapExValue feId={property.onlyChildFeId("capExValue")} />
        <MaintenanceValue feId={property.onlyChildFeId("maintenanceOngoing")} />
        <MiscOngoingCost
          feId={property.onlyChildFeId("miscOngoingCost")}
          menuDisplayNames={["HOA Fees", "Landscaping", "Accounting", "Legal"]}
        />
      </MuiRow>
    </FormSectionLabeled>
  );
}
