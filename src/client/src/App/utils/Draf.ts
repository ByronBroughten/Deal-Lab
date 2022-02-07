import {
  convertToRaw,
  Editor,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import { EntityMapData } from "../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relValue/numObj/entities";
import array from "../sharedWithServer/utils/Arr";

export type EntityMap = Record<
  string,
  {
    data: EntityMapData;
    mutability: "IMMUTABLE";
    type: "TOKEN";
  }
>;
export type EntityRange = { offset: number; length: number; key: number };
export type EntityRanges = EntityRange[];
export interface DraftBlock {
  entityRanges: EntityRanges;
  text: string;
  key: "8rpc7";
  type: "unstyled";
  depth: 0;
  data: {};
  inlineStyleRanges: [];
}
export type DraftBlocks = DraftBlock[];
export type RawEditorState = { blocks: DraftBlock[]; entityMap: EntityMap };

export type EditorRef = React.MutableRefObject<null | Editor>;
export type HandleOnChange = (editorState: EditorState) => void;

export const cleanup = (editorState: EditorState) => {
  // this just gives the editor focus after a button was clicked in attempt to insert something.
  let selection = editorState.getSelection();
  selection = selection.merge({ hasFocus: true });
  editorState = EditorState.acceptSelection(editorState, selection);
  return editorState;
};

export const isEditorChanged = (
  editorState: EditorState,
  newEditorState: EditorState
) => {
  const newContent = newEditorState.getCurrentContent();
  const content = editorState.getCurrentContent();
  return content !== newContent;
};

export const editorToRawContent = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();
  const raw = convertToRaw(content);
  return raw;
};

export const getRawBlock = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();
  const { blocks } = convertToRaw(content);
  const block = blocks[0];
  return block;
};

export const getBlockAndOffset = (editorState: EditorState) => {
  const block = getRawBlock(editorState);
  const selection = editorState.getSelection();
  const focusOffset = selection.getFocusOffset();

  return { block, focusOffset };
};

function getSelectionToBackspace(editorState: EditorState): SelectionState {
  let selection = editorState.getSelection();
  let start = selection.getStartOffset();
  let end = selection.getEndOffset();

  const { entityRanges } = getRawBlock(editorState);
  for (const { offset, length } of entityRanges) {
    const points = array.numsInOffsetLength(offset, length);
    if (points.includes(start as any)) start = offset;
    if (points.includes(end as any)) end = offset + length;
  }

  if (start === end && start !== 0) end -= 1;
  return selection.merge({
    focusOffset: start,
    anchorOffset: end,
  });
}

export function deleteCharsAndEntities(editorState: EditorState): EditorState {
  const selectionToRemove = getSelectionToBackspace(editorState);
  const content = editorState.getCurrentContent();
  const nextContent = Modifier.removeRange(
    content,
    selectionToRemove,
    "backward"
  );

  editorState = EditorState.push(editorState, nextContent, "remove-range");
  let selection = editorState.getSelection();

  selection = selection.merge({
    hasFocus: true,
  });
  return EditorState.acceptSelection(editorState, selection);
}
