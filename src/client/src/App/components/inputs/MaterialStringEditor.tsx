import React from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { GetterVarb } from "./../../sharedWithServer/StateGetters/GetterVarb";
import { MaterialDraftEditor } from "./MaterialDraftEditor";
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
  let { editorState, setEditorState } = useDraftInput(feVarbInfo);
  return (
    <MaterialDraftEditor
      className={"MaterialStringEditor-root " + className ?? ""}
      id={GetterVarb.feVarbInfoToVarbId(feVarbInfo)}
      {...{
        setEditorState,
        editorState,
        label,
      }}
    />
  );
}
