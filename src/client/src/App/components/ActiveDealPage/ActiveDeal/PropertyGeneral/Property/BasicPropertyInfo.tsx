import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import StandardLabel from "../../../../general/StandardLabel";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { SellingCostValue } from "./SellingCostValue";

type Props = { feId: string; className?: string };
export default function BasicPropertyInfo({ feId, className }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <Styled
      {...{
        className: `BasicPropertyInfo-root ${className}`,
        sectionName: "property",
      }}
    >
      <div>
        <StandardLabel>Basics</StandardLabel>
        <div className="BasicPropertyInfo-editors">
          <NumObjEntityEditor
            className={`BasicPropertyInfo-numObjEditor BasicPropertyInfo-marginEditor`}
            feVarbInfo={property.varbInfo("purchasePrice")}
          />
          <NumObjEntityEditor
            className={`BasicPropertyInfo-numObjEditor`}
            feVarbInfo={property.varbInfo("sqft")}
          />
          <NumObjEntityEditor
            className={`BasicPropertyInfo-numObjEditor`}
            feVarbInfo={property.varbInfo("taxesOngoingEditor")}
          />
          <NumObjEntityEditor
            editorType="equation"
            className={`BasicPropertyInfo-numObjEditor`}
            feVarbInfo={property.varbInfo("homeInsOngoingEditor")}
            quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
          />
          <NumObjEntityEditor
            sx={{
              margin: nativeTheme.s3,
              marginLeft: 0,
              marginRight: nativeTheme.s4,
              "& .DraftTextField-root": {
                minWidth: 145,
              },
            }}
            editorType="equation"
            feVarbInfo={property.varbInfo("afterRepairValue")}
            quickViewVarbNames={["purchasePrice", "rehabCost"]}
          />
        </div>
        <SellingCostValue feId={property.onlyChildFeId("sellingCostValue")} />
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  padding-bottom: ${theme.s3};
  .BasicPropertyInfo-editors {
    display: flex;
    flex-wrap: wrap;
    margin-top: ${theme.s15};
  }
  .BasicPropertyInfo-numObjEditor {
    margin: ${theme.s3};
    margin-left: 0;
    margin-right: ${theme.s4};
    .MuiFormControl-root.labeled {
      min-width: 135px;
    }
  }
`;
