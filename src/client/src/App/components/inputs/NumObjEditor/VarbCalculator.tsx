import React from "react";
import { EditorState } from "draft-js";
import styled from "styled-components";
import { insertEntity } from "../../../modules/draftjs/insert";
import theme from "../../../theme/Theme";
import VarbAutoComplete from "../VarbAutoComplete";
import Analyzer from "../../../sharedWithServer/Analyzer";
import { VariableOption } from "../../../sharedWithServer/Analyzer/methods/get/variableOptions";
import { EntityMapData } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/valueMeta/NumObj/entities";

interface Props {
  editorState: EditorState;
  onChange: Function;
}

export default function VarbCalculator({ editorState, onChange }: Props) {
  function onSelect(value: VariableOption) {
    const { displayName, varbInfo } = value;
    const entity: EntityMapData = {
      ...varbInfo,
      entityId: Analyzer.makeId(),
    };

    const newEditorState = insertEntity(editorState, displayName, entity);
    onChange(newEditorState);
  }

  return (
    <Styled className="VarbCalculator-root">
      <div className="VarbCalculator-absolute">
        <div className="VarbCalculator-selectorWrapper VarbCalculator-wrapper">
          <VarbAutoComplete {...{ onSelect, clearOnBlur: true }} />
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  position: relative;
  bottom: 3px;

  .VarbCalculator-absolute {
    position: absolute;
    z-index: 4;
    display: flex;
  }

  .VarbCalculator-wrapper {
    border: 2px solid;
    border-top: 1px solid;
    border-left: 1px solid;
    border-radius: ${theme.br1};
    border-color: ${theme.loan.dark};
    background-color: ${theme["gray-300"]};
  }
  .VarbCalculator-selectorWrapper {
    border-top-left-radius: 0;
    .HideBtn {
      margin-top: ${theme.s1};
      border-top-right-radius: 0;
      border-top-left-radius: 0;
    }
  }
  .VarbCalculator-calculatorWrapper {
    position: relative;
    padding-right: ${theme.s1};
    padding: ${theme.s1};
    border-bottom-right-radius: 0;
    bottom: 23px;
    left: 2px;
  }
`;
