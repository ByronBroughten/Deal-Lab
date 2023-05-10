import React from "react";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import ChunkTitle from "../../../general/ChunkTitle";
import { MaterialStringEditor } from "../../../inputs/MaterialStringEditor";

interface Props extends FeSectionInfo {
  displayName?: React.ReactNode;
}
export function DisplayNameCell({ displayName, ...feInfo }: Props) {
  return (
    <td className="VarbListTable-nameCell">
      {displayName ? (
        <ChunkTitle>{displayName}</ChunkTitle>
      ) : (
        <MaterialStringEditor
          {...{ ...feInfo, varbName: "displayNameEditor" }}
        />
      )}
    </td>
  );
}
