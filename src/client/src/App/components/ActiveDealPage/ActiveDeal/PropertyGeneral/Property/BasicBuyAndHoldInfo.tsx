import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import StandardLabel from "../../../../general/StandardLabel";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { BasicInfoEditorRow } from "./BasicInfoEditorRow";

type Props = { feId: string };
export function BasicBuyAndHoldInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <Styled {...{ sectionName: "property" }}>
      <div>
        <StandardLabel>Basics</StandardLabel>
        <BasicInfoEditorRow>
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
        </BasicInfoEditorRow>
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  padding-bottom: ${theme.s3};
`;
