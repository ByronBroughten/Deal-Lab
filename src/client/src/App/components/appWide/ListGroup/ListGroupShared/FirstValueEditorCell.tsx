import { FeVI } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { MuiRow } from "../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { FirstContentCell } from "./VarbListGeneric/FirstContentCellAndHeader";

interface Props extends FeVI {
  className?: string;
  endAdornment?: JSX.Element | string;
  startAdornment?: JSX.Element | string;
}
export function FirstValueEditorCell({
  className,
  endAdornment,
  ...feVI
}: Props) {
  return (
    <FirstContentCell className={className}>
      <MuiRow sx={{ alignItems: "flex-end", flexWrap: "nowrap" }}>
        <NumObjEntityEditor
          editorType="equation"
          feVarbInfo={feVI}
          labelProps={{ showLabel: false, endAdornment }}
        />
      </MuiRow>
    </FirstContentCell>
  );
}
