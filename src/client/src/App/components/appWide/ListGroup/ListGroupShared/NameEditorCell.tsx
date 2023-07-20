import { Box } from "@mui/material";
import React from "react";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { MaterialStringEditor } from "../../../inputs/MaterialStringEditor";

export function NameEditorCell(feInfo: FeSectionInfo) {
  return (
    <Box
      component={"td"}
      sx={{ "& .DraftTextField-root": { minWidth: "60px" } }}
      className="VarbListTable-nameCell"
    >
      <MaterialStringEditor {...{ ...feInfo, varbName: "displayNameEditor" }} />
    </Box>
  );
}
