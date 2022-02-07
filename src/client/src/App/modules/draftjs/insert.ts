import { EditorState, Modifier } from "draft-js";

export const insertChars = (
  editorState: EditorState,
  chars: string,
  entityKey: string | undefined = undefined
) => {
  let content = editorState.getCurrentContent();
  let selection = editorState.getSelection();
  let focusOffset: number;
  let anchorOffset: number;

  if (selection.isCollapsed()) {
    content = Modifier.insertText(
      content,
      selection,
      chars,
      undefined,
      entityKey
    );
    const initialAnchor = selection.getAnchorOffset();
    anchorOffset = initialAnchor + chars.length;
    focusOffset = anchorOffset;
  } else {
    content = Modifier.replaceText(
      content,
      selection,
      chars,
      undefined,
      entityKey
    );
    const text = content.getPlainText();
    const initialFocus = selection.getFocusOffset();

    anchorOffset = initialFocus + 1;
    focusOffset = initialFocus + 1;
  }

  editorState = EditorState.push(editorState, content, "insert-characters");

  selection = selection.merge({
    hasFocus: true,
    anchorOffset,
    focusOffset,
  });
  editorState = EditorState.acceptSelection(editorState, selection);
  // editorState = EditorState.moveFocusToEnd(editorState);
  return editorState;
};

export const insertEntity = (
  editorState: EditorState,
  chars: string,
  data: any = undefined
) => {
  let content = editorState.getCurrentContent();
  // I change "IMMUTABLE" here and up there, I suppose.
  content = content.createEntity("TOKEN", "IMMUTABLE", data);

  const entityKey = content.getLastCreatedEntityKey();
  editorState = EditorState.set(editorState, {
    currentContent: content,
  });
  editorState = insertChars(editorState, chars, entityKey);
  return editorState;
};
