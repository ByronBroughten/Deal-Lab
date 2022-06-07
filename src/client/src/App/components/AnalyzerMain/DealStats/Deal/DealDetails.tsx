import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import {
  DealDetailRowVarbFound,
  DealDetailRowVarbNotFoundTopLevel,
} from "./DealDetails/DealDetailRow";

export default function DealDetails({ feId }: { feId: string }) {
  const outputList = useGetterSection({
    sectionName: "dealOutputList",
    feId,
  });

  const outputs = outputList.children("output");
  const mixedInfos = outputs.map((output) => output.varbs.varbInfoValues);
  const { sections } = outputList;

  const level = 0;
  return (
    <Styled className="DealDetails-root">
      <div className="DealDetails-allRows">
        {mixedInfos.map((mixedInfo, idx) => {
          const key = mixedInfo.varbName + `${idx}`;
          if (sections.hasSectionMixed(mixedInfo)) {
            const { feVarbInfo } = sections.varbByMixed(mixedInfo);
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
