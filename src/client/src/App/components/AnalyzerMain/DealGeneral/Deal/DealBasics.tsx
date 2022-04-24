import styled from "styled-components";
import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { VariableOption } from "../../../../sharedWithServer/Analyzer/methods/get/variableOptions";
import theme from "../../../../theme/Theme";
import LabeledOutputRowNext from "../../../appWide/LabeledOutputRowNext";
import { LabeledVarbOutputNext } from "../../../appWide/LabeledVarbOutputNext";

const sectionName = "outputList";
export default function DealBasics({ id }: { id: string }) {
  const { analyzer, handleAddSection } = useAnalyzerContext();

  const section = analyzer.section("outputList");
  const outputIds = section.childFeIds("output");
  function onSelect({ varbInfo }: VariableOption) {
    handleAddSection("output", section.feInfo, {
      values: { ...varbInfo },
    });
  }

  return (
    <Styled className="BasicAnalysis-root">
      <LabeledOutputRowNext>
        {outputIds.map((outputId) => (
          <LabeledVarbOutputNext key={outputId} id={outputId} />
        ))}
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
