import { FilledTextFieldProps, TextField } from "@material-ui/core";
import { Editor, EditorProps, EditorState } from "draft-js";
import styled from "styled-components";
import { HandleOnChange } from "../../utils/Draf";
import MaterialDraftField from "./MaterialDraftField";
import React from "react";
import ccs from "../../theme/cssChunks";
import { pick } from "lodash";
import { ThemeSectionName } from "../../theme/Theme";

type ShellProps = {
  endAdornment?: any;
  startAdornment?: any;
};
interface TweakedEditorProps extends Omit<EditorProps, "onChange"> {
  editorState: EditorState;
  handleOnChange: HandleOnChange;
}
interface Props extends Omit<FilledTextFieldProps, "InputProps" | "variant"> {
  sectionName?: ThemeSectionName;
  editorProps: TweakedEditorProps;
  shellProps?: ShellProps;
  onClick?: () => void;
}

function getAdornments(shrinkLabel: boolean, shellProps: ShellProps) {
  if (shrinkLabel) return pick(shellProps, ["endAdornment", "startAdornment"]);
  else return {};
}

export default function MaterialDraftEditor({
  id,
  editorProps,
  onClick,
  className,
  shellProps = {},
  label,
  sectionName,
  ...rest
}: Props) {
  const editorRef = React.useRef<Editor | null>(null);
  const { editorState } = editorProps;
  const hasFocus = editorState.getSelection().getHasFocus();
  const hasText = editorState.getCurrentContent().hasText();

  const shrinkLabel = hasFocus || hasText;
  const { endAdornment, startAdornment } = getAdornments(
    shrinkLabel,
    shellProps
  );

  return (
    <Styled
      {...{ label, className: "editor-wrapper " + className, sectionName }}
    >
      <div className="editor-background">
        <TextField
          {...{
            className: `DraftTextField-root ${label ? "labeled" : ""}`,
            id,
            name: id,
            label,
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
              ...editorProps,
            } as any,
            ...{
              ...shellProps,
              startAdornment,
              endAdornment,
            },
          }}
          InputLabelProps={{
            shrink: shrinkLabel,
          }}
        />
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ label?: any; sectionName?: ThemeSectionName }>`
  ${({ label, sectionName }) =>
    ccs.materialDraftEditor.main({ label, sectionName })};
`;
