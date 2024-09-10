import { useGetterSection } from "../../../../../../../../modules/stateHooks/useGetterSection";
import { MuiRow } from "../../../../../../../general/MuiRow";
import { FormSectionNext } from "../../../../../../appWide/FormSectionNext";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { MiscIncomeValue } from "./ViewParts/MiscIncomeValue";
import { UnitsNext } from "./ViewParts/UnitsNext";

type Props = { feId: string };
export function BasicBuyAndHoldInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionNext>
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("purchasePrice")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("sqft")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("yearBuilt")}
        />
      </MuiRow>
      <UnitsNext feId={feId} />
      <MiscIncomeValue feId={property.onlyChildFeId("miscOngoingRevenue")} />
    </FormSectionNext>
  );
}
