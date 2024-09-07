import { Box, SxProps } from "@mui/material";
import { Editor, EditorState } from "draft-js";
import React from "react";
import { insertChars } from "../../../modules/draftjs/insert";
import { materialDraftEditor } from "../../../theme/nativeTheme/materialDraftEditor";
import { ThemeName } from "../../../theme/Theme";
import { arrSx } from "../../../utils/mui";
import { MaterialDraftField } from "./MaterialDraftField";
import { useOnChange } from "./useOnChange";

type DraftHandlerOutput = "handled" | "not-handled";
type HandleBeforeInput = (char: string) => DraftHandlerOutput;
export type HandleReturn = () => DraftHandlerOutput;
interface Props {
  className?: string;
  sx?: SxProps;
  placeholder?: string;
  sectionName?: ThemeName;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;

  onClick?: () => void;
  handleBeforeInput?: HandleBeforeInput;
  handleReturn?: HandleReturn;
  handlePastedText?: (text: string) => DraftHandlerOutput;

  endAdornment?: any;
  startAdornment?: any;
}

export const BareDraftEditor = React.memo(function BareDraftEditor({
  sx,
  editorState,
  setEditorState,
  onClick,
  className,
  placeholder,
  startAdornment,
  endAdornment,
  handleBeforeInput,
  handleReturn = () => "handled",
  handlePastedText = (text: string) => {
    setEditorState((editorState) => insertChars(editorState, text));
    return "handled";
  },
}: Props) {
  const editorRef = React.useRef<Editor | null>(null);
  const handleOnChange = useOnChange({ setEditorState, editorState });

  const hasFocus = editorState.getSelection().getHasFocus();
  const hasText = editorState.getCurrentContent().hasText();

  return (
    <Box
      {...{
        sx: [materialDraftEditor(), ...arrSx(sx)],
        className,
        onClick: () => {
          editorRef?.current?.focus();
          onClick && onClick();
        },
      }}
    >
      <MaterialDraftField
        {...{
          component: Editor,
          editorState,
          handleOnChange,
          onChange: handleOnChange,
          editorRef,
          placeholder,
          handleBeforeInput,
          handlePastedText,
          handleReturn,
          handlePastedFiles: () => "handled",
          handleDrop: () => "handled",
          handleDroppedFiles: () => "handled",
          startAdornment: startAdornment || (
            <span style={{ visibility: "hidden" }}>.</span>
          ),
          endAdornment,
        }}
      />
    </Box>
  );
});
