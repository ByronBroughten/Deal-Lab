import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { GetterVarb } from "./../../sharedWithServer/StateGetters/GetterVarb";
import { HandleReturn, MaterialDraftEditor } from "./MaterialDraftEditor";
import { useDraftInput } from "./useDraftInput";

interface StringEditorProps extends FeVarbInfo {
  className?: string;
  label?: string;
  handleReturn?: HandleReturn;
}

export function MaterialStringEditor({
  className,
  label,
  handleReturn,
  ...feVarbInfo
}: StringEditorProps) {
  let { editorState, setEditorState } = useDraftInput(feVarbInfo);
  return (
    <MaterialDraftEditor
      className={"MaterialStringEditor-root " + className ?? ""}
      id={GetterVarb.feVarbInfoToVarbId(feVarbInfo)}
      {...{
        handleReturn,
        setEditorState,
        editorState,
        label,
      }}
    />
  );
}
