import React from "react";
import styled from "styled-components";
import SectionBtn from "../appWide/SectionBtn";
import theme from "../../theme/Theme";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { SectionName } from "../../sharedWithServer/Analyzer/SectionMetas/SectionName";

type Props = {
  sectionName: SectionName<"userList">;
  disableUndo: boolean;
  undoEraseSection: () => void;
  didChange: boolean;
  saveUserLists: () => void;
  discardChanges: () => void;
};
export default function ListManagerTitleRow({
  sectionName,
  disableUndo,
  undoEraseSection,
  didChange,
  saveUserLists,
  discardChanges,
}: Props) {
  const { analyzer, handleAddSection } = useAnalyzerContext();
  return (
    <Styled className="title-row">
      <SectionBtn
        className="add-btn"
        onClick={() =>
          handleAddSection(sectionName, analyzer.singleSection("main").feInfo)
        }
      >
        Add List
      </SectionBtn>
      <SectionBtn disabled={!didChange} onClick={saveUserLists}>
        Save Changes
      </SectionBtn>
      <SectionBtn disabled={disableUndo} onClick={undoEraseSection}>
        Undo Delete
      </SectionBtn>
      <SectionBtn disabled={!didChange} onClick={discardChanges}>
        Discard Changes
      </SectionBtn>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex: 0 1;
  align-items: center;
  padding: ${theme.s2};

  margin-bottom: ${theme.s2};
  .main-title {
    position: relative;
    top: 4px;
    margin-left: ${theme.s2};

    font-size: 1.1em;
    line-height: 0;
  }

  .PlusBtn {
    margin-left: ${theme.s3};
  }

  button {
    margin-left: ${theme.s2};
    :disabled {
      border: none;
    }
  }
`;
