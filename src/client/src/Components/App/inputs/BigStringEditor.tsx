import { SxProps } from "@mui/material";
import { GetterVarb } from "../../../sharedWithServer/StateGetters/GetterVarb";
import { FeVarbInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import { MaterialDraftEditor } from "./MaterialDraftEditor";
import { useDraftInput } from "./useDraftInput";

interface Props {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  placeholder?: string;
  sx?: SxProps;
}

export function BigStringEditor({
  feVarbInfo,
  className,
  label,
  placeholder,
  sx,
}: Props) {
  const { editorState, setEditorState } = useDraftInput(feVarbInfo);
  return (
    <MaterialDraftEditor
      {...{
        editorState,
        setEditorState,
        label,
        className: `${className ?? ""}`,
        id: GetterVarb.feVarbInfoToVarbId(feVarbInfo),
        placeholder,
        sx: [
          {
            "& .DraftEditor-root": {
              minWidth: 300,

              ...(label
                ? {
                    pb: nativeTheme.s1,
                  }
                : { py: nativeTheme.s2 }),
            },
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
