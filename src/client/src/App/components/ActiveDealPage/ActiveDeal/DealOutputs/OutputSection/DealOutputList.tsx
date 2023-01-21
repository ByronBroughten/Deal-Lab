import styled from "styled-components";
import { inEntityIdInfo } from "../../../../../sharedWithServer/SectionsMeta/allBaseSectionVarbs/baseValues/InEntityIdInfoValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VariableOption } from "../../../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import theme from "../../../../../theme/Theme";
import { LoadedVarbProps } from "../../../../appWide/LabeledVarb";
import { LoadedVarbRow } from "../../../../appWide/LoadedVarbRow";

function useLoadedOutputRowProps(feId: string): LoadedVarbProps[] {
  const outputList = useGetterSection({
    sectionName: "outputList",
    feId,
  });

  return outputList.children("outputItem").map((outputItem) => {
    const entityVarbInfo = outputItem.value("valueEntityInfo", "inEntityInfo");
    if (entityVarbInfo === null) throw new Error("Value not initialized");
    return { feInfo: outputItem.feInfo };
  });
}

export function DealOutputList({ feId }: { feId: string }) {
  const outPutList = useSetterSection({
    sectionName: "outputList",
    feId,
  });

  const onSelectNext = ({ varbInfo }: VariableOption) =>
    outPutList.addChild("outputItem", {
      dbVarbs: { valueEntityInfo: inEntityIdInfo(varbInfo) },
    });

  const propArr = useLoadedOutputRowProps(feId);
  return (
    <Styled className="DealOutputList-root">
      <LoadedVarbRow {...{ varbPropArr: propArr }} />
    </Styled>
  );
}

// .VarbAutoComplete-root {
//   position: relative;
//   top: 2px;
//   .MuiInputBase-root {
//     height: ${theme.bigButtonHeight};
//     border-radius: ${theme.br0};
//     margin-left: ${theme.s2};
//     min-width: 110px;
//   }
// }

const Styled = styled.div`
  .BasicAnalysis-addOutput {
    font-size: 2rem;
    height: 100%;
    width: 2rem;

    box-shadow: ${theme.boxShadow1};
    border-radius: ${theme.br0};
    padding: ${theme.s2};
  }
`;
