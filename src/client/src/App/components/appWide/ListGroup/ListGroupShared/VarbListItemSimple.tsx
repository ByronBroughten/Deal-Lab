import { SxProps } from "@mui/material";
import React from "react";
import { FeVI } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { StrictExtract } from "../../../../sharedWithServer/utils/types";
import { FirstValueEditorCell } from "./FirstValueEditorCell";
import { NameEditorCell } from "./NameEditorCell";
import { VarbListItemStyled } from "./VarbListItemStyled";
import { XBtnCell } from "./XBtnCell";

type Name = StrictExtract<
  SectionName,
  "onetimeItem" | "periodicEditor" | "numVarbItem"
>;
interface Props<SN extends Name> extends FeVI<SN> {
  valueEditorProps?: { endAdornment?: React.ReactNode };
  sx?: SxProps;
}
export function VarbListItemSimple<SN extends Name>({
  valueEditorProps = {},
  sx,
  varbName,
  ...feInfo
}: Props<SN>) {
  return (
    <VarbListItemStyled sx={sx}>
      <NameEditorCell {...feInfo} />
      <FirstValueEditorCell
        {...{
          className: "VarbListItemSimple-editorCell",
          valueEditorProps,
          ...feInfo,
          varbName,
        }}
      />
      <XBtnCell {...feInfo} />
    </VarbListItemStyled>
  );
}
