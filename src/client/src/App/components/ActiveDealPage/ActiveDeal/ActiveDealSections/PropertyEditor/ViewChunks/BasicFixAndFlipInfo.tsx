import styled from "styled-components";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import theme from "../../../../../../theme/Theme";
import { FormSection } from "../../../../../appWide/FormSection";
import { LabelWithInfo } from "../../../../../appWide/LabelWithInfo";
import ChunkTitle from "../../../../../general/ChunkTitle";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
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
            editorType="equation"
            feVarbInfo={property.varbInfo("afterRepairValue")}
            quickViewVarbNames={["purchasePrice", "rehabCost"]}
            label={
              <LabelWithInfo
                {...{
                  label: "After repair value",
                  infoTitle: "After Repair Value",
                  infoText: `This is the price that a property is sold at after repairs are made.`,
                }}
              />
            }
            sx={{
              margin: nativeTheme.s3,
              marginLeft: 0,
              marginRight: nativeTheme.s4,
              "& .DraftEditor-root": {
                minWidth: 145,
              },
            }}
          />
          <SellingCostValue feId={property.onlyChildFeId("sellingCostValue")} />
        </MuiRow>
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  padding-bottom: ${theme.s3};
`;
