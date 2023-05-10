import styled from "styled-components";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import theme from "../../../../../../theme/Theme";
import { FormSection } from "../../../../../appWide/FormSection";
import { LabelWithInfo } from "../../../../../appWide/LabelWithInfo";
import { BasicInfoEditorRow } from "../../../../../appWide/MarginEditorRow";
import ChunkTitle from "../../../../../general/ChunkTitle";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { SellingCostValue } from "./ViewParts/SellingCostValue";

type Props = { feId: string };
export function BasicFixAndFlipInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <Styled {...{ sectionName: "property" }}>
      <div>
        <ChunkTitle>Basics</ChunkTitle>
        <BasicInfoEditorRow>
          <NumObjEntityEditor
            {...{
              label: "Purchase price",
              feVarbInfo: property.varbInfo("purchasePrice"),
            }}
          />
          <NumObjEntityEditor
            feVarbInfo={property.varbInfo("numUnitsEditor")}
          />
          <NumObjEntityEditor feVarbInfo={property.varbInfo("sqft")} />
          <NumObjEntityEditor
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
        </BasicInfoEditorRow>
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  padding-bottom: ${theme.s3};
`;
