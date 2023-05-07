import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { BasicInfoEditorRow } from "../../../../../appWide/MarginEditorRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { CapExValueNext } from "./ViewParts/CapExValueNext";
import { MaintenanceValueNext } from "./ViewParts/MaintenanceValueNext";
import { MiscOngoingCost } from "./ViewParts/MiscOngoingCost";
import { UtilityValueNext } from "./ViewParts/UtilityValueNext";

export function PropertyOngoingCosts({ feId }: FeIdProp) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionLabeled label="Ongoing Costs">
      <BasicInfoEditorRow>
        <NumObjEntityEditor
          feVarbInfo={property.varbInfo("taxesOngoingEditor")}
        />
        <NumObjEntityEditor
          editorType="equation"
          feVarbInfo={property.varbInfo("homeInsOngoingEditor")}
          quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
        />
        <UtilityValueNext feId={property.onlyChildFeId("utilityValue")} />
        <CapExValueNext feId={property.onlyChildFeId("capExValue")} />
        <MaintenanceValueNext
          feId={property.onlyChildFeId("maintenanceValue")}
        />
        <MiscOngoingCost
          feId={property.onlyChildFeId("miscOngoingCost")}
          menuDisplayNames={["HOA Fees", "Landscaping", "Accounting", "Legal"]}
        />
      </BasicInfoEditorRow>
    </FormSectionLabeled>
  );
}
