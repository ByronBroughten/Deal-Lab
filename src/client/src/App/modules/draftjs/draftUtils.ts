import {
  ContentState,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { Dispatch, SetStateAction } from "react";
import { NumObj } from "../../../sharedWithServer/stateSchemas/StateValue/NumObj";
import { RawEditorState } from "../../utils/DraftS";

export type SetEditorState = Dispatch<SetStateAction<EditorState>>;

export default function getNewRawContent() {
  const editorState = EditorState.createEmpty();
  const content = editorState.getCurrentContent();
  const rawContent = convertToRaw(content);
  return rawContent;
}

export const getRawContentFromEditorState = (editorState: EditorState) => {
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
export const draftUtils = {
  editorStateToText,
  getRawContentFromEditorState,
  contentStateToRaw(contentState: ContentState): RawDraftContentState {
    return convertToRaw(contentState);
  },
  contentStateText(contentState: ContentState): string {
    const raw = convertToRaw(contentState);
    return textFromRaw(raw);
  },
};

export function editorStateToText(editorState: EditorState) {
  const content = editorState.getCurrentContent();
  const raw = convertToRaw(content);
  const text = textFromRaw(raw);
  return text;
}

export const textToRawContent = (text: string): RawDraftContentState => {
  const rawContent = getNewRawContent();
  applyTextToRawContent({ rawContent, text });
  return rawContent;
};

export function numObjToRawContent(numObj: NumObj): RawDraftContentState {
  const { mainText, entities } = numObj;
  const raw = textToRawContent(mainText);
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
