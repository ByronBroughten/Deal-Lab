import React from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import MaterialDraftEditor from "./MaterialDraftEditor";
import { useDraftInput } from "./useDraftInput";

interface StringEditorProps extends FeVarbInfo {
  className?: string;
  label?: string;
}

export function MaterialStringEditor({
  className,
  label,
  ...feVarbInfo
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
