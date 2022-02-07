import React from "react";
import styled from "styled-components";
import { FeVarbInfo } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { ThemeSectionName } from "../../theme/Theme";
import MaterialDraftEditor from "./MaterialDraftEditor";
import { createStringEditor } from "./MaterialStringEditor";
import useDraftInput from "./useDraftInput";

export interface Props {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  sectionName?: ThemeSectionName;
}

export default function BigStringEditor({
  feVarbInfo,
  className = "",
  sectionName,
  label,
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
        className: "string-editor " + className,
        id: varb.stringFeVarbInfo,
        editorProps: {
          editorState,
          handleOnChange: onChange,
        },
      }}
    />
  );
}

const Styled = styled(MaterialDraftEditor)``;
