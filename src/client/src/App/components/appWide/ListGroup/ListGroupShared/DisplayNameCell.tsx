import React from "react";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import StandardLabel from "../../../general/StandardLabel";
import { MaterialStringEditor } from "../../../inputs/MaterialStringEditor";

interface Props extends FeSectionInfo {
  displayName?: React.ReactNode;
}
export function DisplayNameCell({ displayName, ...feInfo }: Props) {
  return (
    <td className="VarbListTable-nameCell">
      {displayName ? (
        <StandardLabel>{displayName}</StandardLabel>
      ) : (
        <MaterialStringEditor
          {...{ ...feInfo, varbName: "displayNameEditor" }}
        />
      )}
    </td>
  );
}
