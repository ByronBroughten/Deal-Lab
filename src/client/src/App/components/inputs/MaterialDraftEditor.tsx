import { Box, FilledTextFieldProps, SxProps, TextField } from "@mui/material";
import { Editor, EditorState } from "draft-js";
import { pick } from "lodash";
import React from "react";
import { insertChars } from "../../modules/draftjs/insert";
import { materialDraftEditor } from "../../theme/nativeTheme/materialDraftEditor";
import { ThemeName } from "../../theme/Theme";
import { arrSx } from "../../utils/mui";
import { MaterialDraftField } from "./MaterialDraftField";
import { PropAdornments } from "./NumObjEditor/useGetAdornments";
import { useOnChange } from "./useOnChange";

type DraftHandlerOutput = "handled" | "not-handled";
type HandleBeforeInput = (char: string) => DraftHandlerOutput;
export type HandleReturn = () => DraftHandlerOutput;
interface Props extends Omit<FilledTextFieldProps, "InputProps" | "variant"> {
  sx?: SxProps;
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

function getEntityEditorAdornments(
  shrinkLabel: boolean,
  shellProps: PropAdornments
) {
  if (shrinkLabel) return pick(shellProps, ["endAdornment", "startAdornment"]);
  else return {};
}

export const MaterialDraftEditor = React.memo(function MaterialDraftEditor({
  sx,
  id,
  editorState,
  setEditorState,
  onClick,
  className,
  label,
  placeholder,
  startAdornment,
  endAdornment,
  handleBeforeInput,
  handleReturn = () => "handled",
  handlePastedText = (text: string) => {
    setEditorState((editorState) => insertChars(editorState, text));
    return "handled";
  },
  ...rest
}: Props) {
  const editorRef = React.useRef<Editor | null>(null);
  const handleOnChange = useOnChange({ setEditorState, editorState });

  const hasFocus = editorState.getSelection().getHasFocus();
  const hasText = editorState.getCurrentContent().hasText();

  const shrinkLabel = true; // hasFocus || hasText;
  ({ endAdornment, startAdornment } = getEntityEditorAdornments(shrinkLabel, {
    startAdornment,
    endAdornment,
  }));

  return (
    <Box
      {...{
        sx: [materialDraftEditor(label), ...arrSx(sx)],
        label,
        className: "editor-wrapper " + className,
      }}
    >
      <div className="MaterialDraftEditor-wrapper">
        <TextField
          {...{
            className: `DraftTextField-root ${
              label ? "DraftTextField-labeled" : ""
            }`,
            id,
            name: id,
            label: label ?? "",
            variant: "filled",
            hiddenLabel: label ? false : true,
            ...rest,
          }}
          onClick={() => {
            editorRef?.current?.focus();
            onClick && onClick();
          }}
          InputProps={{
            inputComponent: MaterialDraftField as any,
            inputProps: {
              component: Editor,
              editorRef,
              editorState,
              placeholder,
              handleOnChange,
              handleBeforeInput,
              handlePastedText,
              handleReturn,
              handlePastedFiles: () => "handled",
              handleDrop: () => "handled",
              handleDroppedFiles: () => "handled",
            } as any,
            startAdornment: startAdornment || (
              <span style={{ visibility: "hidden" }}>.</span>
            ),
            endAdornment,
          }}
          InputLabelProps={{
            shrink: shrinkLabel,
          }}
        />
      </div>
    </Box>
  );
});
