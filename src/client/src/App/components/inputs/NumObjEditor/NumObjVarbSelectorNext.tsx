import { EditorState } from "draft-js";
import React from "react";
import styled from "styled-components";
import { SetEditorState } from "../../../modules/draftjs/draftUtils";
import { insertEntity } from "../../../modules/draftjs/insert";
import { EntityMapData } from "../../../sharedWithServer/SectionsMeta/allBaseSectionVarbs/baseValues/entities";
import { Id } from "../../../sharedWithServer/SectionsMeta/allBaseSectionVarbs/id";
import { VariableOption } from "../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import theme from "../../../theme/Theme";
import { HollowBtn } from "../../appWide/HollowBtn";
import { PopperRef } from "../VarbAutoComplete";

interface Props {
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  // this gets the quick-access props, yeah?
}

type OnSelectProps = {
  setEditorState: SetEditorState;
  variableOption: VariableOption;
};

function onSelect({ setEditorState, variableOption }: OnSelectProps) {
  const { displayName, varbInfo } = variableOption;
  const entity: EntityMapData = {
    ...varbInfo,
    entityId: Id.make(),
  };
  setEditorState((editorState) =>
    insertEntity(editorState, displayName, entity)
  );
}

// What I need first is just a button next to another button.
export const NumObjVarbSelectorNext = React.memo(
  React.forwardRef(({ setEditorState }: Props, ref: PopperRef) => {
    return (
      <Styled className="NumObjVarbSelector-root">
        <div className="NumObjVarbSelector-absolute">
          <div className="NumObjVarbSelector-wrapper">
            <HollowBtn {...{ text: "+ Variable" }} />
          </div>
        </div>
      </Styled>
    );
  })
);

const Styled = styled.div`
  position: relative;
  bottom: 3px;

  .VarbAutoComplete-root {
    .MuiInputBase-root {
      margin-top: ${theme.s1};
    }
  }

  .NumObjVarbSelector-absolute {
    position: absolute;
    z-index: 4;
    display: flex;
  }
  .NumObjVarbSelector-wrapper {
    border: 2px solid;
    border-top: 1px solid;
    border-left: 1px solid;
    border-radius: ${theme.br0};
    border-color: ${theme.next.dark};
    background-color: ${theme["gray-300"]};
    border-top-left-radius: 0;
    .HideBtn {
      margin-top: ${theme.s1};
      border-top-right-radius: 0;
      border-top-left-radius: 0;
    }
  }
  .NumObjVarbSelector-calculatorWrapper {
    position: relative;
    padding-right: ${theme.s1};
    padding: ${theme.s1};
    border-bottom-right-radius: 0;
    bottom: 23px;
    left: 2px;
  }
`;
