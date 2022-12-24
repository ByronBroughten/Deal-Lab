import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import {
  DealDetailRowVarbFound,
  DealDetailRowVarbNotFoundTopLevel,
} from "./DealDetails/DealDetailRow";

export default function DealDetails({ feId }: { feId: string }) {
  const outputList = useGetterSection({
    sectionName: "outputList",
    feId,
  });
  const outputs = outputList.children("outputItem");
  const level = 0;
  return (
    <Styled className="DealDetails-root">
      <div className="DealDetails-allRows">
        {outputs.map((output, idx) => {
          const mixedInfo = output.valueInEntityInfo();
          const key = mixedInfo.varbName + `${idx}`;
          if (output.hasSectionByFocalMixed(mixedInfo)) {
            const { feVarbInfo } = output.varbByFocalMixed(mixedInfo);
            return (
              <DealDetailRowVarbFound
                {...{ varbInfo: feVarbInfo, level, key }}
              />
            );
          } else {
            return <DealDetailRowVarbNotFoundTopLevel key={key} />;
          }
        })}
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  padding: ${theme.s2};
  .DealDetails-allRows {
    box-shadow: ${theme.boxShadow1};
  }
`;
