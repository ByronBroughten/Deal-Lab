import styled from "styled-components";
import theme from "../../../../../theme/Theme";
import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import { VariableOption } from "../../../../../sharedWithServer/Analyzer/methods/get/variableOptions";
import { LabeledVarbOutputNext } from "../../../../appWide/LabeledVarbOutputNext";
import LabeledOutputRowNext from "../../../../appWide/LabeledOutputRowNext";
import SectionBtn from "../../../../appWide/SectionBtn";
import { BiPlus } from "react-icons/bi";

const sectionName = "analysis";
export default function AnalysisBasics({ id }: { id: string }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer, handleAddSection } = useAnalyzerContext();

  const outputIds = analyzer.childFeIds([feInfo, "output"]);
  function onSelect({ varbInfo }: VariableOption) {
    handleAddSection("output", feInfo, { values: varbInfo });
  }

  return (
    <Styled className="BasicAnalysis-root">
      <LabeledOutputRowNext>
        {outputIds.map((outputId) => (
          <LabeledVarbOutputNext key={outputId} id={outputId} />
        ))}
        {/* <SectionBtn
          themeName="analysis"
          className="BasicAnalysis-addOutput LabeledVarb-root"
        >
          <BiPlus />
        </SectionBtn> */}
        {/* <VarbAutoComplete
          {...{
            onSelect,
            className: "MainEntryTitleRow-addSelector",
            placeholder: "+ Metric",
          }}
        /> */}
      </LabeledOutputRowNext>
    </Styled>
  );
}

// .VarbAutoComplete-root {
//   position: relative;
//   top: 2px;
//   .MuiInputBase-root {
//     height: ${theme.bigButtonHeight};
//     border-radius: ${theme.br1};
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
