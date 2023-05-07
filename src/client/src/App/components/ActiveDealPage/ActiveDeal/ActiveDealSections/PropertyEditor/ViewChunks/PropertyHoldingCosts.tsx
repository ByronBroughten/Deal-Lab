import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { LabelWithInfo } from "../../../../../appWide/LabelWithInfo";
import { BasicInfoEditorRow } from "../../../../../appWide/MarginEditorRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { MiscHoldingCost } from "./ViewParts/MiscHoldingCost";
import { UtilityValueNext } from "./ViewParts/UtilityValueNext";

export function PropertyHoldingCosts({ feId }: FeIdProp) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  return (
    <FormSectionLabeled label="Holding Costs">
      <BasicInfoEditorRow>
        <NumObjEntityEditor
          label={
            <LabelWithInfo
              {...{
                label: "Holding period",
                infoTitle: "Holding Period",
                infoText: `This is the amount of time that a property is owned before its rehab is complete and it is either sold (in the case of fix and flip) or refinanced and rented out (in the case of brrrr).\n\nTypically, the longer the holding period, the more that costs will accumulate.`,
              }}
            />
          }
          feVarbInfo={property.varbInfo("holdingPeriodSpanEditor")}
        />
        <NumObjEntityEditor
          feVarbInfo={property.varbInfo("taxesOngoingEditor")}
        />
        <NumObjEntityEditor
          editorType="equation"
          feVarbInfo={property.varbInfo("homeInsOngoingEditor")}
          quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
        />
        <UtilityValueNext feId={property.onlyChildFeId("utilityValue")} />
        <MiscHoldingCost feId={property.onlyChildFeId("miscHoldingCost")} />
      </BasicInfoEditorRow>
    </FormSectionLabeled>
  );
}
