import styled from "styled-components";
import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { switchNames } from "../../../../sharedWithServer/SectionMetas/baseSections/switchNames";
import { FeInfo, Inf } from "../../../../sharedWithServer/SectionMetas/Info";
import theme from "../../../../theme/Theme";
import MaterialStringEditor from "../../../inputs/MaterialStringEditor";
import NumObjEditor from "../../../inputs/NumObjEditor";

type Props = { feInfo: FeInfo; valueVarbName: string };

export default function LabeledSpanOverCost({ valueVarbName, feInfo }: Props) {
  const { analyzer } = useAnalyzerContext();
  const valueVarb = analyzer.feVarb(valueVarbName, feInfo);
  const lifeSpanName = analyzer.switchedVarbName(
    feInfo,
    switchNames("lifespan", "monthsYears")
  );
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor feVarbInfo={Inf.feVarb("name", feInfo)} />
      </td>
      <Styled className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEditor
            feVarbInfo={Inf.feVarb("costToReplace", feInfo)}
            labeled={false}
          />
          <span className="LabeledSpanOverCost-over">/</span>
          <NumObjEditor
            feVarbInfo={Inf.feVarb(lifeSpanName, feInfo)}
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
