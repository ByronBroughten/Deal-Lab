import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { MuiRow } from "../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { FirstContentCell } from "./VarbListGeneric/FirstContentCellAndHeader";

interface Props extends FeSectionInfo {
  className?: string;
  endAdornment?: string;
  valueEditorName:
    | "valueEditor"
    | "valueDollarsEditor"
    | "valueDollarsPeriodicEditor";
}
export function FirstValueEditorCell({
  className,
  endAdornment,
  valueEditorName,
  ...feInfo
}: Props) {
  return (
    <FirstContentCell className={className}>
      <MuiRow sx={{ alignItems: "flex-end", flexWrap: "nowrap" }}>
        <NumObjEntityEditor
          editorType="equation"
          feVarbInfo={{
            ...feInfo,
            varbName: valueEditorName,
          }}
          labeled={false}
          endAdornment={endAdornment}
        />
      </MuiRow>
    </FirstContentCell>
  );
}
