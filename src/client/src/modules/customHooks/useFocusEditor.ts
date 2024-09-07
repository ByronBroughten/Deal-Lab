import { Editor } from "draft-js";
import { useCallback } from "react";

// probably hardly worth the trouble of using
export default function useFocusEditor(editorRef: { current: Editor | null }) {
  const focusEditor = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [editorRef]);
  return focusEditor;
}
