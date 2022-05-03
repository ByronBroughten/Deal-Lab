import { Button } from "@material-ui/core";
import { EditorState } from "draft-js";
import { CgCalculator } from "react-icons/cg";
import styled from "styled-components";
import { insertChars } from "../../../modules/draftjs/insert";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import ccs from "../../../theme/cssChunks";
import theme from "../../../theme/Theme";
import { cleanup, deleteCharsAndEntities } from "../../../utils/DraftS";
import { getAttrsFn } from "../../../utils/styledComponents";
import CalculatorBtns from "./Calculator/CalculatorBtns";
import varbCalcInputParser from "./numericEditorParser";

function insertChar(editorState: EditorState, char: string): EditorState {
  if (varbCalcInputParser({ char, editorState }))
    return insertChars(editorState, char);
  else return cleanup(editorState);
}

type Props = { editorState: EditorState; onChange: Function };
export default function Calculator({ editorState, onChange }: Props) {
  const { dropCalculator, toggleDropCalculator } = useAnalyzerContext();

  function handleClick(char: string) {
    editorState = insertChar(editorState, char);
    onChange(editorState);
  }

  function handleBackspace() {
    editorState = deleteCharsAndEntities(editorState);
    onChange(editorState);
  }

  return dropCalculator ? (
    <StyledCalcWrapper>
      <div className="Calculator-root">
        <Button className="HideBtn" onClick={toggleDropCalculator}>
          Hide
        </Button>
        <CalculatorBtns {...{ handleClick, handleBackspace }} />
      </div>
    </StyledCalcWrapper>
  ) : (
    <StyledIconWrapper>
      <CgCalculator
        className="NumObjEditor-calcIcon"
        onClick={toggleDropCalculator}
      />
    </StyledIconWrapper>
  );
}

const StyledCalcWrapper = styled.div.attrs(
  getAttrsFn("NumObjEditor-calcPositioner")
)`
  .Calculator-root {
    border: 1px solid ${theme["gray-500"]};
    background-color: ${theme["gray-300"]};
    border-radius: ${theme.br1};
    padding: ${theme.s1};
    .MuiTouchRipple-root {
      visibility: hidden;
    }
  }

  /* padding-left: ${theme.s1}; */

  .HideBtn {
    padding: ${theme.s1};
    width: 100%;
    line-height: 1;
    ${ccs.coloring.button.varbSelector};
    margin-bottom: ${theme.s1};
  }
`;

const StyledIconWrapper = styled.div.attrs(
  getAttrsFn("NumObjEditor-calcIconPositioner")
)`
  .HideBtn {
    padding: ${theme.s1};
    width: 100%;
    line-height: 1;
    ${ccs.coloring.button.varbSelector};
  }

  .NumObjEditor-calcIcon {
    position: absolute;
    background: ${theme["gray-300"]};
    ${ccs.size("20px")};
    border-radius: ${theme.br1};
    padding: 0;
    :hover,
    :focus {
      box-shadow: ${theme.boxShadow1};
      color: ${theme.loan.dark};
    }
    cursor: pointer;
  }
`;
