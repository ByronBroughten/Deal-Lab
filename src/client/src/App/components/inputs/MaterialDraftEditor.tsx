import { FilledTextFieldProps, TextField } from "@material-ui/core";
import { Editor, EditorState } from "draft-js";
import { pick } from "lodash";
import React from "react";
import styled from "styled-components";
import ccs from "../../theme/cssChunks";
import theme, { ThemeName } from "../../theme/Theme";
import { MaterialDraftField } from "./MaterialDraftField";
import { PropAdornments } from "./NumObjEditor/useGetAdornments";
import { useOnChange } from "./useOnChange";

type HandleBeforeInput = (char: string) => "handled" | "not-handled";
interface Props extends Omit<FilledTextFieldProps, "InputProps" | "variant"> {
  sectionName?: ThemeName;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;

  onClick?: () => void;
  handleBeforeInput?: HandleBeforeInput;

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
  id,
  editorState,
  setEditorState,
  onClick,
  className,
  label,
  sectionName,
  placeholder,
  startAdornment,
  endAdornment,
  handleBeforeInput,
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
    <Styled
      {...{ label, className: "editor-wrapper " + className, sectionName }}
    >
      <div className="MaterialDraftEditor-wrapper">
        <TextField
          {...{
            className: `DraftTextField-root ${label ? "labeled" : ""}`,
            id,
            name: id,
            label: label ?? "",
            variant: "filled",
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
              handleReturn: React.useCallback(() => "handled" as "handled", []),
            } as any,
            startAdornment,
            endAdornment,
          }}
          InputLabelProps={{
            shrink: shrinkLabel,
          }}
        />
      </div>
    </Styled>
  );
});

const Styled = styled.div<{ label?: any; sectionName?: ThemeName }>`
  ${({ label, sectionName }) =>
    ccs.materialDraftEditor.main({ label, sectionName })};
  .public-DraftEditorPlaceholder-root {
    position: absolute;
    white-space: nowrap;
    color: ${theme.placeholderGray};
  }
`;
