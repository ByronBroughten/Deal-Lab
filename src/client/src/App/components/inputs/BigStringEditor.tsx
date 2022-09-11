import React from "react";
import styled from "styled-components";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { ThemeName } from "../../theme/Theme";
import MaterialDraftEditor from "./MaterialDraftEditor";
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
  const { onChange, varb, editorState } = useDraftInput(feVarbInfo);
  return (
    <Styled
      {...{
        sectionName: themeName,
        label,
        className: `BigStringEditor-root ${className ?? ""}`,
        id: varb.varbId,
        editorProps: {
          editorState,
          handleOnChange: onChange,
          placeholder,
        },
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
