import { FeIdProp } from "../../../../../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { useGetterSection } from "../../../../../../../../stateHooks/useGetterSection";
import { MuiRow } from "../../../../../../../general/MuiRow";
import { FormSectionLabeled } from "../../../../../../appWide/FormSectionLabeled";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";
import { CapExValue } from "./ViewParts/CapExValue";
import { MaintenanceValue } from "./ViewParts/MaintenanceValue";
import { MiscOngoingCost } from "./ViewParts/MiscOngoingCost";
import { UtilityValue } from "./ViewParts/UtilityValue";

export function PropertyOngoingCosts({ feId }: FeIdProp) {
  const property = useGetterSection({ sectionName: "property", feId });

  const taxes = property.onlyChild("taxesOngoing");
  const homeIns = property.onlyChild("homeInsOngoing");
  const propertyMode = property.valueNext("propertyMode");
  return (
    <FormSectionLabeled label="Ongoing Costs">
      <MuiRow>
        <PeriodicEditor
          inputMargins
          feId={taxes.onlyChildFeId("valueDollarsEditor")}
          labelInfo={taxes.periodicVBI("valueDollars")}
        />
        <PeriodicEditor
          inputMargins
          editorType="equation"
          feId={homeIns.onlyChildFeId("valueDollarsEditor")}
          labelInfo={homeIns.periodicVBI("valueDollars")}
          quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
        />
        <UtilityValue
          propertyMode={property.valueNext("propertyMode")}
          periodicMode={"ongoing"}
          feId={property.onlyChildFeId("utilityOngoing")}
        />
        <CapExValue feId={property.onlyChildFeId("capExValueOngoing")} />
        <MaintenanceValue
          propertyMode={propertyMode}
          feId={property.onlyChildFeId("maintenanceOngoing")}
        />
        <MiscOngoingCost
          feId={property.onlyChildFeId("miscOngoingCost")}
          menuDisplayNames={[
            "HOA fees",
            "Yardwork",
            "Gutter cleaning",
            ...(propertyMode === "homeBuyer" ? [] : ["Accounting", "Legal"]),
          ]}
        />
      </MuiRow>
    </FormSectionLabeled>
  );
}
