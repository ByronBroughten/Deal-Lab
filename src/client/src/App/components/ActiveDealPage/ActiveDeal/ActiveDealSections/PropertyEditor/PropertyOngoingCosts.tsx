import { FeIdProp } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../appWide/FormSectionLabeled";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { BasicInfoEditorRow } from "./BasicInfoEditorRow";
import { CapExValueNext } from "./CapExValueNext";
import { MaintenanceValueNext } from "./MaintenanceValueNext";
import { MiscOngoingCost } from "./MiscOngoingCost";
import { UtilityValueNext } from "./UtilityValueNext";

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
