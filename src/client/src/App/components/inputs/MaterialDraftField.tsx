import { Editor, EditorProps, EditorState } from "draft-js";
import React from "react";
import useFocusEditor from "../../modules/customHooks/useFocusEditor";

export type EditorRef = React.MutableRefObject<null | Editor>;

type Props = EditorProps & {
  editorRef: EditorRef;
  component: typeof Editor;
  handleOnChange: (newEditorState: EditorState) => void;
};
export const MaterialDraftField = React.forwardRef(function MaterialDraftField(
  props: Props,
  ref
) {
  const { component: DraftEditor, editorRef, handleOnChange, ...rest } = props;

  const focusEditor = useFocusEditor(editorRef);
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      focusEditor();
    },
  }));

  return <DraftEditor {...rest} ref={editorRef} onChange={handleOnChange} />;
});
