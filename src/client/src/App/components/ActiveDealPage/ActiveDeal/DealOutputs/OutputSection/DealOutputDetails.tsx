import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import {
  DealDetailRowVarbFound,
  DealDetailRowVarbNotFoundTopLevel,
} from "./DealOutputDetails/DealDetailRow";

export function DealOutputDetails({ feId }: { feId: string }) {
  const outputList = useGetterSection({
    sectionName: "outputList",
    feId,
  });
  const outputs = outputList.children("outputItem");
  const level = 0;
  return (
    <Styled className="DealOutputDetails-root">
      {outputs.map((output, idx) => {
        const mixedInfo = output.valueInEntityInfo();
        const key = mixedInfo.varbName + `${idx}`;
        if (output.hasSectionByFocalMixed(mixedInfo)) {
          const { feVarbInfo } = output.varbByFocalMixed(mixedInfo);
          return (
            <DealDetailRowVarbFound {...{ varbInfo: feVarbInfo, level, key }} />
          );
        } else {
          return <DealDetailRowVarbNotFoundTopLevel key={key} />;
        }
      })}
    </Styled>
  );
}

const Styled = styled.div`
  border: solid 1px ${theme.primaryNext};
  border-radius: ${theme.br0};
  padding: ${theme.s1} 0;
`;
