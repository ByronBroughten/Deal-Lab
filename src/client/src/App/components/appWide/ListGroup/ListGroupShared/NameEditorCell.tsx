import React from "react";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { MaterialStringEditor } from "../../../inputs/MaterialStringEditor";

export function NameEditorCell(feInfo: FeSectionInfo) {
  return (
    <td className="VarbListTable-nameCell">
      <MaterialStringEditor {...{ ...feInfo, varbName: "displayNameEditor" }} />
    </td>
  );
}
