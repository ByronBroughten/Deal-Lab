import { SxProps } from "@mui/material";
import { arrSx } from "../../../modules/utils/mui";
import { GetterVarb } from "../../../sharedWithServer/StateGetters/GetterVarb";
import { FeVarbInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { BareDraftEditor } from "./BareDraftEditor";
import { useDraftInput } from "./useDraftInput";

interface Props {
  feVarbInfo: FeVarbInfo;
  className?: string;
  placeholder?: string;
  sx?: SxProps;
  noSolve?: boolean;
}

export function BareStringEditor({
  feVarbInfo,
  className,
  placeholder,
  noSolve,
  sx,
}: Props) {
  const { editorState, setEditorState } = useDraftInput({
    ...feVarbInfo,
    noSolve,
  });
  return (
    <BareDraftEditor
      {...{
        editorState,
        setEditorState,
        className: `${className ?? ""}`,
        id: GetterVarb.feVarbInfoToVarbId(feVarbInfo),
        placeholder,
        sx: [
          {
            "& .DraftEditor-root": {
              minWidth: 200,
            },
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
