import React from "react";
import styled from "styled-components";
import { VarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { ThemeName } from "../../theme/Theme";
import MaterialDraftEditor from "./MaterialDraftEditor";
import { useDraftInputNext } from "./useDraftInputNext";

interface Props {
  feVarbInfo: VarbInfo;
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
  const { onChange, varb, editorState } = useDraftInputNext({
    ...feVarbInfo,
    valueType: "string",
  });
  return (
    <Styled
      {...{
        sectionName: themeName,
        label,
        className: `BigStringEditor-root string-editor ${className ?? ""}`,
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
