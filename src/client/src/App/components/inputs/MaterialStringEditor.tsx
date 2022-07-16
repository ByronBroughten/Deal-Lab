import React from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import MaterialDraftEditor from "./MaterialDraftEditor";
import { useDraftInputNext } from "./useDraftInputNext";

export interface StringEditorProps {
  feVarbInfo: FeVarbInfo;
  className?: string;
  valueType?: "string" | "stringObj";
  label?: string;
}

export function MaterialStringEditor({
  feVarbInfo,
  className = "",
  valueType = "string",
  label,
}: StringEditorProps) {
  let { editorState, onChange, varb } = useDraftInputNext({
    ...feVarbInfo,
    valueType,
  });
  return (
    <MaterialDraftEditor
      className={"string-editor " + className}
      id={varb.varbId}
      editorProps={{ editorState, handleOnChange: onChange }}
      label={label}
    />
  );
}
