import styled from "styled-components";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";

interface Props extends FeSectionInfo {
  className?: string;
  endAdornment?: string;
}
export function FirstValueEditorCell({
  className,
  endAdornment,
  ...feInfo
}: Props) {
  return (
    <td className={`VarbListTable-firstContentCell ${className ?? ""}`}>
      <div className="VarbListItem-contentCellDiv ">
        <NumObjEntityEditor
          editorType="equation"
          feVarbInfo={{
            ...feInfo,
            varbName: "valueEditor",
          }}
          className="LabeledValueEditor-equationEditor"
          labeled={false}
          endAdornment={endAdornment}
        />
      </div>
    </td>
  );
}

const Styled = styled.td``;
