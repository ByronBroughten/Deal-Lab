import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import { nativeTheme } from "../../theme/nativeTheme";
import { MaterialDraftEditor } from "./MaterialDraftEditor";
import { useDraftInput } from "./useDraftInput";

interface Props {
  feVarbInfo: FeVarbInfo;
  className?: string;
  label?: any;
  placeholder?: string;
}

export function BigStringEditor({
  feVarbInfo,
  className,
  label,
  placeholder,
}: Props) {
  const { editorState, setEditorState } = useDraftInput(feVarbInfo);
  return (
    <MaterialDraftEditor
      {...{
        editorState,
        setEditorState,
        label,
        className: `BigStringEditor-root ${className ?? ""}`,
        id: GetterVarb.feVarbInfoToVarbId(feVarbInfo),
        placeholder,
        sx: {
          "& .DraftEditor-root": {
            minWidth: 300,
            py: nativeTheme.s2,
          },
        },
      }}
    />
  );
}
