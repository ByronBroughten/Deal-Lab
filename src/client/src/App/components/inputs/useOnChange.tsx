import { EditorState } from "draft-js";
import { isEditorChanged } from "../../utils/Draf";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { Dispatch, SetStateAction } from "react";
import { FeVarbInfo } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";

interface UseOnChangeProps {
  feVarbInfo: FeVarbInfo;
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
}
export default function useOnChange({
  feVarbInfo,
  editorState,
  setEditorState,
}: UseOnChangeProps) {
  const { handleUpdateFromEditor } = useAnalyzerContext();

  return function onChange(newEditorState: EditorState) {
    const editorIsChanged = isEditorChanged(editorState, newEditorState);
    const selection = editorState.getSelection();
    if (!selection.getHasFocus() && !editorIsChanged) {
      newEditorState = EditorState.moveFocusToEnd(newEditorState);
    }

    setEditorState(() => {
      if (editorIsChanged) {
        handleUpdateFromEditor({ feVarbInfo, editorState: newEditorState });
      }
      return newEditorState;
    });
  };
}
