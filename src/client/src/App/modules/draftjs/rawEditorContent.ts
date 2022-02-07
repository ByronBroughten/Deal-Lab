import { convertToRaw, EditorState } from "draft-js";
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

export const textToRawContent = (text: string) => {
  const rawContent = getNewRawContent();
  applyTextToRawContent({ rawContent, text });
  return rawContent;
};
