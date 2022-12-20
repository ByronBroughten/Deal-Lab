import React from "react";
import styled from "styled-components";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import { ThemeName } from "../../theme/Theme";
import { MaterialDraftEditor } from "./MaterialDraftEditor";
import { useDraftInput } from "./useDraftInput";

interface Props {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  themeName?: ThemeName;
  placeholder?: string;
}

export function BigStringEditor({
  feVarbInfo,
  className,
  themeName,
  label,
  placeholder,
}: Props) {
  const { editorState, setEditorState } = useDraftInput(feVarbInfo);
  return (
    <Styled
      {...{
        sectionName: themeName,
        editorState,
        setEditorState,
        label,
        className: `BigStringEditor-root ${className ?? ""}`,
        id: GetterVarb.feVarbInfoToVarbId(feVarbInfo),
        placeholder,
      }}
    />
  );
}

const Styled = styled(MaterialDraftEditor)`
  .DraftEditor-root {
    min-width: 100px;
    font-size: 1.1rem;
  }
`;
