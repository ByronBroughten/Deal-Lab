import { EditorState } from "draft-js";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
import { useToggleViewNext } from "../../../modules/customHooks/useToggleView";
import { SetEditorState } from "../../../modules/draftjs/draftUtils";
import { insertEntity } from "../../../modules/draftjs/insert";
import { EntityMapData } from "../../../sharedWithServer/SectionsMeta/allBaseSectionVarbs/baseValues/entities";
import { Id } from "../../../sharedWithServer/SectionsMeta/allBaseSectionVarbs/id";
import { VarbPathName } from "../../../sharedWithServer/SectionsMeta/SectionInfo/VarbPathNameInfo";
import { makeVarbPathOption } from "../../../sharedWithServer/StateEntityGetters/pathVarbOptions";
import theme from "../../../theme/Theme";
import { HollowBtn } from "../../appWide/HollowBtn";
import { ModalText } from "../../appWide/ModalText";
import { PopperRef } from "../VarbAutoComplete";

interface Props {
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  varbPathNames?: VarbPathName[];
}

type OnSelectProps = {
  setEditorState: SetEditorState;
  varbPathName: VarbPathName;
};

function onSelect({ setEditorState, varbPathName }: OnSelectProps) {
  const { displayName, varbInfo } = makeVarbPathOption(varbPathName);
  const entity: EntityMapData = {
    ...varbInfo,
    entityId: Id.make(),
  };
  setEditorState((editorState) =>
    insertEntity(editorState, displayName, entity)
  );
}

export const NumObjVarbSelectorNext = React.memo(
  React.forwardRef(
    ({ setEditorState, varbPathNames = [] }: Props, ref: PopperRef) => {
      const { toggleVarbs, varbsIsOpen } = useToggleViewNext("varbs");
      const { openInfo, infoIsOpen, closeInfo } = useToggleViewNext("info");
      return (
        <Styled ref={ref} className="NumObjVarbSelector-root">
          <div className="NumObjVarbSelector-absolute">
            <div className="NumObjVarbSelector-wrapper">
              <div className="NumObjVarbSelector-BtnDiv">
                <AddVarbBtn
                  {...{ middle: "+ Variable", onClick: toggleVarbs }}
                />
                <InfoBtn
                  className="NumObjVarbSelector-infoBtn"
                  middle={<AiOutlineInfoCircle size={19} />}
                  onClick={openInfo}
                />
                <ModalText
                  {...{
                    show: infoIsOpen,
                    closeModal: closeInfo,
                    title: "Equation Editor and Variables",
                  }}
                >
                  {`This input is an Equation Editor. It lets you enter numbers as well as symbols to add (+), subtract (-), multiply (*) and divide (/).\n\nAdditionally, you may also enter variables. This lets the input respond to other inputs, much excel spreadsheet cells with formulas.\n\nTo add a variable, simply click the "+ Variable" button and choose one from the dropdown that appears.`}
                </ModalText>
              </div>
            </div>
          </div>
        </Styled>
      );
    }
  )
);

const InfoBtn = styled(HollowBtn)`
  border-radius: 0;
  border: none;
  color: ${theme.primary.main};
  padding: ${theme.s2} ${theme.s2} 0 ${theme.s2};
  border-left: 1px solid ${theme.primary.light};
  :hover {
    background-color: ${theme.primary.main};
  }
`;

const AddVarbBtn = styled(HollowBtn)`
  border-radius: 0;
  border: none;
  color: ${theme.primary.main};
  :hover {
    background-color: ${theme.primary.main};
  }
`;

const Styled = styled.div`
  position: relative;
  bottom: 3px;

  .NumObjVarbSelector-BtnDiv {
    display: flex;
    align-items: center;
  }

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
