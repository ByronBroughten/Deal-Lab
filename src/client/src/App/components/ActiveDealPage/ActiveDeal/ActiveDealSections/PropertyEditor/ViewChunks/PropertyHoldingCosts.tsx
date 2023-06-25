import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { VarbLabel } from "../../../../../appWide/VarbLabel";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { MiscHoldingCost } from "./ViewParts/MiscHoldingCost";
import { UtilityValue } from "./ViewParts/UtilityValue";

export function PropertyHoldingCosts({ feId }: FeIdProp) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  const taxes = property.onlyChild("taxesHolding");
  const homeIns = property.onlyChild("homeInsHolding");
  const holdingPeriodInfo = property.varbInfoNext("holdingPeriodSpanEditor");
  return (
    <FormSectionLabeled label="Holding Costs">
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          label={<VarbLabel names={holdingPeriodInfo} />}
          feVarbInfo={holdingPeriodInfo}
        />
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
          feId={property.onlyChildFeId("utilityHolding")}
        />
        <MiscHoldingCost feId={property.onlyChildFeId("miscHoldingCost")} />
      </MuiRow>
    </FormSectionLabeled>
  );
}
