import { Box, FilledTextFieldProps, SxProps, TextField } from "@mui/material";
import { Editor, EditorState } from "draft-js";
import { pick } from "lodash";
import React from "react";
import { materialDraftEditor } from "../../theme/nativeTheme/materialDraftEditor";
import { ThemeName } from "../../theme/Theme";
import { arrSx } from "../../utils/mui";
import { MaterialDraftField } from "./MaterialDraftField";
import { PropAdornments } from "./NumObjEditor/useGetAdornments";
import { useOnChange } from "./useOnChange";

type HandleBeforeInput = (char: string) => "handled" | "not-handled";
export type HandleReturn = () => "handled" | "not-handled";
interface Props extends Omit<FilledTextFieldProps, "InputProps" | "variant"> {
  sx?: SxProps;
  sectionName?: ThemeName;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;

  onClick?: () => void;
  handleBeforeInput?: HandleBeforeInput;
  handleReturn?: HandleReturn;

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
  ...rest
}: Props) {
  const editorRef = React.useRef<Editor | null>(null);
  const handleOnChange = useOnChange({ setEditorState, editorState });

  const hasFocus = editorState.getSelection().getHasFocus();
  const hasText = editorState.getCurrentContent().hasText();

  const shrinkLabel = hasFocus || hasText;
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
            className: `DraftTextField-root ${label ? "labeled" : ""}`,
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
              handleReturn,
            } as any,
            startAdornment,
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
