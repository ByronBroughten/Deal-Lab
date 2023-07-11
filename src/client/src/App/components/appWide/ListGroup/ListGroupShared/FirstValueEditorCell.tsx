import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";

interface Props extends FeSectionInfo {
  className?: string;
  endAdornment?: string;
  valueEditorName: "valueDollarsEditor" | "valueDollarsPeriodicEditor";
}
export function FirstValueEditorCell({
  className,
  endAdornment,
  valueEditorName,
  ...feInfo
}: Props) {
  return (
    <td className={`VarbListTable-firstContentCell ${className ?? ""}`}>
      <div className="VarbListItem-contentCellDiv ">
        <NumObjEntityEditor
          editorType="equation"
          feVarbInfo={{
            ...feInfo,
            varbName: valueEditorName,
          }}
          className="LabeledValueEditor-equationEditor"
          labeled={false}
          endAdornment={endAdornment}
        />
      </div>
    </td>
  );
}
