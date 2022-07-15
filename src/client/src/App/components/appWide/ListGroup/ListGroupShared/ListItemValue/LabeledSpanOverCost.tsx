import styled from "styled-components";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { MaterialStringEditorNext } from "../../../../inputs/MaterialStringEditorNext";
import { NumObjEditorNext } from "../../../../inputs/NumObjEditorNext";

type Props = { feInfo: FeSectionInfo<"ongoingItem">; valueVarbName: string };

export default function LabeledSpanOverCost({ valueVarbName, feInfo }: Props) {
  const section = useGetterSection(feInfo);
  const valueVarb = section.varb(valueVarbName);
  const lifespanName = section.switchVarb("lifespan", "monthsYears")
    .varbName as "lifespanMonths" | "lifespanYears";
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditorNext feVarbInfo={section.varbInfo("name")} />
      </td>
      <Styled className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEditorNext
            feVarbInfo={section.varbInfo("costToReplace")}
            labeled={false}
          />
          <span className="LabeledSpanOverCost-over">/</span>
          <NumObjEditorNext
            feVarbInfo={section.varbInfo(lifespanName)}
            className="lifespan"
            labeled={false}
          />
          <span className="LabeledSpanOverCost-equals">{`= ${valueVarb.displayVarb()}`}</span>
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
