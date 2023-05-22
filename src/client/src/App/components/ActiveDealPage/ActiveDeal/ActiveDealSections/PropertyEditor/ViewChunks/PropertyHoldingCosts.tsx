import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { LabelWithInfo } from "../../../../../appWide/LabelWithInfo";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { MiscHoldingCost } from "./ViewParts/MiscHoldingCost";
import { UtilityValue } from "./ViewParts/UtilityValue";

export function PropertyHoldingCosts({ feId }: FeIdProp) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  return (
    <FormSectionLabeled label="Holding Costs">
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
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
          inputMargins
          feVarbInfo={property.varbInfo("taxesHoldingPeriodicEditor")}
        />
        <NumObjEntityEditor
          inputMargins
          editorType="equation"
          feVarbInfo={property.varbInfo("homeInsHoldingPeriodicEditor")}
          quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
        />
        <UtilityValue
          propertyMode={property.valueNext("propertyMode")}
          feId={property.onlyChildFeId("utilityHolding")}
        />
        <MiscHoldingCost feId={property.onlyChildFeId("miscHoldingCost")} />
      </MuiRow>
    </FormSectionLabeled>
  );
}
