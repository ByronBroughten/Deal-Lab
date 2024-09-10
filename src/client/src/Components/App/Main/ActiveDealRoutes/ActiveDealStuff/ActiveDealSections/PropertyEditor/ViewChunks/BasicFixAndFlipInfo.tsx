import styled from "styled-components";
import { useGetterSection } from "../../../../../../../../modules/stateHooks/useGetterSection";
import theme from "../../../../../../../../theme/Theme";
import { MuiRow } from "../../../../../../../general/MuiRow";
import { FormSectionNext } from "../../../../../../appWide/FormSectionNext";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ArvEditor } from "./ViewParts/ArvEditor";
import { SellingCostValue } from "./ViewParts/SellingCostValue";

type Props = { feId: string };
export function BasicFixAndFlipInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <Styled {...{ sectionName: "property" }}>
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          {...{
            label: "Purchase price",
            feVarbInfo: property.varbInfo2("purchasePrice"),
          }}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("numUnitsEditor")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("sqft")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("yearBuilt")}
        />
        <ArvEditor feId={feId} />
        <SellingCostValue feId={property.onlyChildFeId("sellingCostValue")} />
      </MuiRow>
    </Styled>
  );
}

const Styled = styled(FormSectionNext)`
  padding-bottom: ${theme.s3};
`;
