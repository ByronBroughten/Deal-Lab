import styled from "styled-components";
import LabeledOutputRow from "../../appWide/LabeledOutputRow";
import theme from "../../../theme/Theme";
import VarbAutoComplete from "../../inputs/VarbAutoComplete";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { LabeledVarbOutput } from "../../appWide/LabeledVarbOutput";
import { VariableOption } from "../../../sharedWithServer/Analyzer/methods/variableOptions";

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
      <LabeledOutputRow>
        <VarbAutoComplete
          {...{
            onSelect,
            className: "MainEntryTitleRow-addSelector",
            placeholder: "Add Analysis Value",
          }}
        />
        {outputIds.map((outputId) => (
          <LabeledVarbOutput key={outputId} id={outputId} />
        ))}
      </LabeledOutputRow>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: flex-start;

  .LabeledOutputRow-root {
    position: relative;
    margin-left: ${theme.s2};
  }
  .LabeledVarb-root {
    position: relative;
    bottom: 4px;
  }

  .LabeledVarb-label {
    color: ${theme["gray-800"]};
  }

  .VarbAutoComplete-root {
    position: relative;
    top: 2px;
    .MuiInputBase-root {
      height: ${theme.bigButtonHeight};
      border-radius: ${theme.br1};
      margin-left: ${theme.s2};
      min-width: 110px;
    }
  }
`;
