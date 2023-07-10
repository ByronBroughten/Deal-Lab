import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { ArvEditor } from "./ViewParts/ArvEditor";
import { MiscIncomeValue } from "./ViewParts/MiscIncomeValue";
import { UnitsNext } from "./ViewParts/UnitsNext";

type Props = { feId: string };
export function BasicBrrrrInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionLabeled {...{ label: "Basics" }}>
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("purchasePrice")}
        />
        <ArvEditor feId={feId} />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("sqft")}
        />
        <UnitsNext feId={feId} />
        <MiscIncomeValue feId={property.onlyChildFeId("miscOngoingRevenue")} />
      </MuiRow>
    </FormSectionLabeled>
  );
}
