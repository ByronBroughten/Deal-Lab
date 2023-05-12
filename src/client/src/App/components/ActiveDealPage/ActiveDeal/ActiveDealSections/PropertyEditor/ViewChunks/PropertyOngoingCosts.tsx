import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { BasicInfoEditorRow } from "../../../../../appWide/MarginEditorRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { CapExValue } from "./ViewParts/CapExValue";
import { MaintenanceValue } from "./ViewParts/MaintenanceValue";
import { MiscOngoingCost } from "./ViewParts/MiscOngoingCost";
import { UtilityValue } from "./ViewParts/UtilityValue";

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
        <UtilityValue feId={property.onlyChildFeId("utilityValue")} />
        <CapExValue feId={property.onlyChildFeId("capExValue")} />
        <MaintenanceValue feId={property.onlyChildFeId("maintenanceValue")} />
        <MiscOngoingCost
          feId={property.onlyChildFeId("miscOngoingCost")}
          menuDisplayNames={["HOA Fees", "Landscaping", "Accounting", "Legal"]}
        />
      </BasicInfoEditorRow>
    </FormSectionLabeled>
  );
}
