import React from "react";
import styled from "styled-components";
import { FeVarbInfo } from "../../sharedWithServer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { ThemeSectionName } from "../../theme/Theme";
import MaterialDraftEditor from "./MaterialDraftEditor";
import { createStringEditor } from "./MaterialStringEditor";
import useDraftInput from "./useDraftInput";

export interface Props {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  sectionName?: ThemeSectionName;
  placeholder?: string;
}

export default function BigStringEditor({
  feVarbInfo,
  className = "",
  sectionName,
  label,
  placeholder,
}: Props) {
  const { editorState, onChange, varb } = useDraftInput(
    feVarbInfo,
    "string",
    ({ varb }) => createStringEditor({ varb })
  );

  return (
    <Styled
      {...{
        sectionName,
        label,
        className: "BigStringEditor-root string-editor " + className,
        id: varb.stringFeVarbInfo,
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
    min-width: 50px;
    font-size: 1.1rem;
  }
`;
