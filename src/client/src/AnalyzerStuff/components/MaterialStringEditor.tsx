import { ContentState, EditorState } from "draft-js";
import React from "react";
import MaterialDraftEditor from "../../App/components/inputs/MaterialDraftEditor";
import { FeVarbInfo } from "../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import StateVarb from "../modules/Analyzer/StateSection/StateVarb";
import useDraftInput from "./useDraftInput";

export const createStringEditor = ({
  varb,
}: {
  varb: StateVarb;
}): EditorState => {
  const content = ContentState.createFromText(varb.value("string"));
  return EditorState.createWithContent(content);
};

export interface StringEditorProps {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: string;
}
export default function MaterialStringEditor({
  feVarbInfo,
  className = "",
  label,
}: StringEditorProps) {
  let { editorState, onChange, varb } = useDraftInput(
    feVarbInfo,
    "string",
    createStringEditor
  );

  return (
    <MaterialDraftEditor
      className={"string-editor " + className}
      id={varb.fullName} // the id is for screen readers
      editorProps={{ editorState, handleOnChange: onChange }}
      label={label}
    />
  );
}
