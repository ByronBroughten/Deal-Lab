import { EditorState } from "draft-js";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
import { useToggleViewNext } from "../../../modules/customHooks/useToggleView";
import { VarbPathName } from "../../../sharedWithServer/SectionsMeta/SectionInfo/VarbPathNameInfo";
import theme from "../../../theme/Theme";
import { HollowBtn } from "../../appWide/HollowBtn";
import { ModalText } from "../../appWide/ModalText";
import { PopperRef } from "../VarbAutoComplete";
import { VarbSelectorRows } from "./NumObjVarbSelector/VarbSelectorRows";

interface Props {
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  varbPathNames?: VarbPathName[];
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
              {varbsIsOpen && (
                <VarbSelectorRows
                  {...{
                    varbPathNames,
                    setEditorState,
                  }}
                />
              )}
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
  height: 25px;
  :hover {
    background-color: ${theme.primary.main};
  }
`;

const AddVarbBtn = styled(HollowBtn)`
  border-radius: 0;
  border: none;
  color: ${theme.primary.main};
  height: 25px;
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
    background: ${theme.light};
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
