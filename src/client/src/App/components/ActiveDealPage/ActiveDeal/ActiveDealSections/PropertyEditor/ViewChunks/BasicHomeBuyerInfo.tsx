import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string };
export function BasicHomeBuyerInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionLabeled {...{ label: "Basics" }}>
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("purchasePrice")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("sqft")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("numBedroomsEditor")}
        />
      </MuiRow>
    </FormSectionLabeled>
  );
}
