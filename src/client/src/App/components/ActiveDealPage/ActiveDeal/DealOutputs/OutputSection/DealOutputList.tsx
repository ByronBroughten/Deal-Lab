import styled from "styled-components";
import { inEntityValueInfo } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VariableOption } from "../../../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import theme from "../../../../../theme/Theme";
import { LabeledVarbProps } from "../../../../appWide/LabeledVarb";
import { LabeledVarbRow } from "../../../../appWide/LabeledVarbRow";

function useLoadedOutputRowProps(feId: string): LabeledVarbProps[] {
  const outputList = useGetterSection({
    sectionName: "outputList",
    feId,
  });

  return outputList.children("outputItem").map((outputItem) => {
    const entityVarbInfo = outputItem.valueEntityInfo();
    const { feVarbInfo } = outputItem.varbByFocalMixed(entityVarbInfo);
    return feVarbInfo;
  });
}

export function DealOutputList({ feId }: { feId: string }) {
  const outPutList = useSetterSection({
    sectionName: "outputList",
    feId,
  });

  const onSelectNext = ({ varbInfo }: VariableOption) =>
    outPutList.addChild("outputItem", {
      sectionValues: { valueEntityInfo: inEntityValueInfo(varbInfo) },
    });

  const propArr = useLoadedOutputRowProps(feId);
  return (
    <Styled className="DealOutputList-root">
      <LabeledVarbRow {...{ varbPropArr: propArr }} />
    </Styled>
  );
}

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
