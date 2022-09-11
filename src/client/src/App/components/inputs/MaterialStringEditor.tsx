import React from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import MaterialDraftEditor from "./MaterialDraftEditor";
import { useDraftInput } from "./useDraftInput";

export interface StringEditorProps {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: string;
}

export function MaterialStringEditor({
  feVarbInfo,
  className,
  label,
}: StringEditorProps) {
  let { editorState, onChange, varb } = useDraftInput(feVarbInfo);
  return (
    <MaterialDraftEditor
      className={"MaterialStringEditor-root " + className ?? ""}
      id={varb.varbId}
      editorProps={{ editorState, handleOnChange: onChange }}
      label={label}
    />
  );
}
