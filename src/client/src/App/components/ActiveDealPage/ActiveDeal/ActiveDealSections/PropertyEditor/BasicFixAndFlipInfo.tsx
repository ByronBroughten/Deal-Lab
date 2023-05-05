import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import StandardLabel from "../../../../general/StandardLabel";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { BasicInfoEditorRow } from "./BasicInfoEditorRow";
import { SellingCostValue } from "./SellingCostValue";

type Props = { feId: string };
export function BasicFixAndFlipInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <Styled {...{ sectionName: "property" }}>
      <div>
        <StandardLabel>Basics</StandardLabel>
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
              "& .DraftTextField-root": {
                minWidth: 150,
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
