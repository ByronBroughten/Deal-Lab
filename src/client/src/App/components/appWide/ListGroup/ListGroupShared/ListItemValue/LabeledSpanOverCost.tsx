import styled from "styled-components";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import theme from "../../../../../theme/Theme";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

interface Props extends FeSectionInfo<"ongoingItem"> {
  displayValueVarb: string;
  lifespanVarbName: string;
}

export function LabeledSpanOverCost({
  sectionName,
  feId,
  lifespanVarbName,
  displayValueVarb,
}: Props) {
  const feInfo = { sectionName, feId };
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor
          {...{ ...feInfo, varbName: "displayNameEditor" }}
        />
      </td>
      <Styled className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEntityEditor
            feVarbInfo={{
              ...feInfo,
              varbName: "costToReplace",
            }}
            labeled={false}
          />
          <span className="LabeledSpanOverCost-over">/</span>
          <NumObjEntityEditor
            feVarbInfo={{
              ...feInfo,
              varbName: lifespanVarbName,
            }}
            className="lifespan"
            labeled={false}
          />
          <span className="LabeledSpanOverCost-equals">{`= ${displayValueVarb}`}</span>
        </div>
      </Styled>
    </>
  );
}

const Styled = styled.td`
  display: flex;
  align-items: center;
  .LabeledSpanOverCost-equals {
    margin-left: ${theme.s2};
  }
  .LabeledSpanOverCost-over {
    font-size: 1.4em;
    margin: 0 ${theme.s1} 0 ${theme.s1};
  }
`;
