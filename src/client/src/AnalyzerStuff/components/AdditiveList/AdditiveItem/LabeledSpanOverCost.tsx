import styled from "styled-components";
import { switchNames } from "../../../../App/sharedWithServer/SectionsMeta/baseSections/switchNames";
import {
  FeInfo,
  InfoS,
} from "../../../../App/sharedWithServer/SectionsMeta/Info";
import theme from "../../../../App/theme/Theme";
import MaterialStringEditor from "../../MaterialStringEditor";
import NumObjEditor from "../../NumObjEditor";
import { useAnalyzerContext } from "../../usePropertyAnalyzer";

type Props = { feInfo: FeInfo; valueVarbName: string };

export default function LabeledSpanOverCost({ valueVarbName, feInfo }: Props) {
  const { analyzer } = useAnalyzerContext();
  const valueVarb = analyzer.feVarb(valueVarbName, feInfo);
  const lifespanName = analyzer.switchedVarbName(
    feInfo,
    switchNames("lifespan", "monthsYears")
  );
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor feVarbInfo={InfoS.feVarb("name", feInfo)} />
      </td>
      <Styled className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEditor
            feVarbInfo={InfoS.feVarb("costToReplace", feInfo)}
            labeled={false}
          />
          <span className="LabeledSpanOverCost-over">/</span>
          <NumObjEditor
            feVarbInfo={InfoS.feVarb(lifespanName, feInfo)}
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
