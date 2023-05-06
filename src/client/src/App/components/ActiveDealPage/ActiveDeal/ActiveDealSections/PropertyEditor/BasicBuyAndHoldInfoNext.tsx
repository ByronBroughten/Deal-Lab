import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../appWide/FormSectionLabeled";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { BasicInfoEditorRow } from "./BasicInfoEditorRow";
import { MiscIncomeValue } from "./MiscIncomeValue";
import { UnitsNext } from "./UnitsNext";

type Props = { feId: string };
export function BasicBuyAndHoldInfoNext({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  const hasUnits = property.childFeIds("unit").length > 0;

  return (
    <FormSectionLabeled {...{ label: "Basics" }}>
      <BasicInfoEditorRow>
        <NumObjEntityEditor
          className={`BasicPropertyInfo-numObjEditor BasicPropertyInfo-marginEditor`}
          feVarbInfo={property.varbInfo("purchasePrice")}
        />
        <NumObjEntityEditor
          className={`BasicPropertyInfo-numObjEditor`}
          feVarbInfo={property.varbInfo("sqft")}
        />
      </BasicInfoEditorRow>
      <UnitsNext feId={feId} />
      <MiscIncomeValue feId={property.onlyChildFeId("miscIncomeValue")} />
    </FormSectionLabeled>
  );
}
