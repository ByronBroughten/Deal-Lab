import styled from "styled-components";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../../theme/Theme";
import { FormSection } from "../../../../../appWide/FormSection";
import ChunkTitle from "../../../../../general/ChunkTitle";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { ArvEditor } from "./ViewParts/ArvEditor";
import { SellingCostValue } from "./ViewParts/SellingCostValue";

type Props = { feId: string };
export function BasicFixAndFlipInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <Styled {...{ sectionName: "property" }}>
      <div>
        <ChunkTitle>Basics</ChunkTitle>
        <MuiRow>
          <NumObjEntityEditor
            inputMargins
            {...{
              label: "Purchase price",
              feVarbInfo: property.varbInfo("purchasePrice"),
            }}
          />
          <NumObjEntityEditor
            inputMargins
            feVarbInfo={property.varbInfo("numUnitsEditor")}
          />
          <NumObjEntityEditor
            inputMargins
            feVarbInfo={property.varbInfo("sqft")}
          />
          <NumObjEntityEditor
            inputMargins
            feVarbInfo={property.varbInfo("yearBuilt")}
          />
          <ArvEditor feId={feId} />
          <SellingCostValue feId={property.onlyChildFeId("sellingCostValue")} />
        </MuiRow>
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  padding-bottom: ${theme.s3};
`;
