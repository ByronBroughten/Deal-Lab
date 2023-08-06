import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { MuiFavoriteRating } from "../../../../../general/MuiFavoriteRating";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string };
export function BasicHomebuyerInfo({ feId }: Props) {
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
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("yearBuilt")}
        />
      </MuiRow>
      <MuiFavoriteRating {...property.varbInfo("likability")} />
    </FormSectionLabeled>
  );
}
