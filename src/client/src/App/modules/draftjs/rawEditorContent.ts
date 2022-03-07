import { convertToRaw, EditorState, RawDraftContentState } from "draft-js";
import { NumObj } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/valueMeta/NumObj";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { RawEditorState } from "../../utils/Draf";

export default function getNewRawContent() {
  const editorState = EditorState.createEmpty();
  const content = editorState.getCurrentContent();
  const rawContent = convertToRaw(content);
  return rawContent;
}

export const getRawEditorState = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();
  return convertToRaw(content) as any as RawEditorState;
};

export const applyTextToRawContent = ({
  rawContent,
  text,
}: {
  rawContent: any;
  text: string;
}) => {
  rawContent.blocks[0].text = `${text}`;
};

export const textFromRaw = (rawContent: any) => {
  const text = rawContent.blocks[0].text;
  return text;
};

export const editorStateToText = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();
  const raw = convertToRaw(content);
  const text = textFromRaw(raw);
  return text;
};

export const textToRawContent = (text: string): RawDraftContentState => {
  const rawContent = getNewRawContent();
  applyTextToRawContent({ rawContent, text });
  return rawContent;
};

export function numObjToRawContent(numObj: NumObj): RawDraftContentState {
  const { editorText, entities } = numObj;
  const raw = textToRawContent(editorText);
  for (const [idx, entity] of Object.entries(entities)) {
    raw.entityMap[idx] = {
      data: entity,
      mutability: "IMMUTABLE",
      type: "TOKEN",
    };
    raw.blocks[0].entityRanges.push({
      key: parseInt(idx),
      offset: entity.offset,
      length: entity.length,
    });
  }
  return raw;
}
