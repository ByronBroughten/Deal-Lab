import { SxProps } from "@mui/material";
import { FeVarbInfo } from "../../../sharedWithServer/SectionInfo/FeInfo";
import { GetterVarb } from "../../../sharedWithServer/StateGetters/GetterVarb";
import { HandleReturn, MaterialDraftEditor } from "./MaterialDraftEditor";
import { useDraftInput } from "./useDraftInput";

interface StringEditorProps extends FeVarbInfo {
  className?: string;
  label?: string;
  handleReturn?: HandleReturn;
  placeholder?: string;
  sx?: SxProps;
}

export function MaterialStringEditor({
  className,
  label,
  handleReturn,
  placeholder,
  sx,
  ...feVarbInfo
}: StringEditorProps) {
  let { editorState, setEditorState } = useDraftInput(feVarbInfo);
  return (
    <MaterialDraftEditor
      {...{
        id: GetterVarb.feVarbInfoToVarbId(feVarbInfo),
        className,
        placeholder,
        handleReturn,
        setEditorState,
        editorState,
        label,
        sx,
      }}
    />
  );
}
