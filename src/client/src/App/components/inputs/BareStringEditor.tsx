import { SxProps } from "@mui/material";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import { arrSx } from "../../utils/mui";
import { BareDraftEditor } from "./BareDraftEditor";
import { useDraftInput } from "./useDraftInput";

interface Props {
  feVarbInfo: FeVarbInfo;
  className?: string;
  placeholder?: string;
  sx?: SxProps;
}

export function BareStringEditor({
  feVarbInfo,
  className,
  placeholder,
  sx,
}: Props) {
  const { editorState, setEditorState } = useDraftInput(feVarbInfo);
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
