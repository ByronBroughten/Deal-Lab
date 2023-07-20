import { SxProps } from "@mui/material";
import React from "react";
import { VarbName } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { StrictExtract } from "../../../../sharedWithServer/utils/types";
import { FirstValueEditorCell } from "./FirstValueEditorCell";
import { NameEditorCell } from "./NameEditorCell";
import { VarbListItemStyled } from "./VarbListItemStyled";
import { XBtnCell } from "./XBtnCell";

type Name = StrictExtract<
  SectionName,
  "onetimeItem" | "periodicItem" | "numVarbItem"
>;
interface Props<SN extends Name> extends FeSectionInfo<SN> {
  valueEditorName: Extract<
    VarbName<SN>,
    "valueEditor" | "valueDollarsEditor" | "valueDollarsPeriodicEditor"
  >;
  valueEditorProps?: { endAdornment?: React.ReactNode };
  sx?: SxProps;
}
export function VarbListItemSimple<SN extends Name>({
  valueEditorProps = {},
  valueEditorName,
  sx,
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
          valueEditorName,
        }}
      />
      <XBtnCell {...feInfo} />
    </VarbListItemStyled>
  );
}
