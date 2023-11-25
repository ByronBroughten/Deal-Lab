import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionNext } from "../../../../../appWide/FormSectionNext";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { ArvEditor } from "./ViewParts/ArvEditor";
import { MiscIncomeValue } from "./ViewParts/MiscIncomeValue";
import { UnitsNext } from "./ViewParts/UnitsNext";

type Props = { feId: string };
export function BasicBrrrrInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionNext>
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("purchasePrice")}
        />
        <ArvEditor feId={feId} />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("sqft")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("yearBuilt")}
        />
        <UnitsNext feId={feId} />
        <MiscIncomeValue feId={property.onlyChildFeId("miscOngoingRevenue")} />
      </MuiRow>
    </FormSectionNext>
  );
}
