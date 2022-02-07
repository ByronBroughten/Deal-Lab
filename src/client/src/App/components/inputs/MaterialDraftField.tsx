import { Editor, EditorState, EditorProps } from "draft-js";
import React from "react";
import useFocusEditor from "../../modules/customHooks/useFocusEditor";

export type EditorRef = React.MutableRefObject<null | Editor>;

type Props = EditorProps & {
  editorRef: EditorRef;
  component: typeof Editor;
  handleOnChange: (newEditorState: EditorState) => void;
};
export default React.forwardRef(function DraftField(props: Props, ref) {
  const { component: DraftEditor, editorRef, handleOnChange, ...rest } = props;
  // DraftEditor is the straight draft-js editor component being used

  const focusEditor = useFocusEditor(editorRef);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      focusEditor();
    },
  }));

  return <DraftEditor {...rest} ref={editorRef} onChange={handleOnChange} />;
});
