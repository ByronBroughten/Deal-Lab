import React from "react";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { DisplayNameCell } from "./DisplayNameCell";
import { FirstValueEditorCell } from "./FirstValueEditorCell";
import { VarbListItemStyledNext } from "./VarbListItemStyled";
import { XBtnCell } from "./XBtnCell";

interface Props
  extends FeSectionInfo<
    "singleTimeItem" | "ongoingItem" | "userVarbItem" | "outputItem"
  > {
  valueEditorProps?: { endAdornment?: React.ReactNode };
}
export function VarbListItemGeneric({
  valueEditorProps = {},
  ...feInfo
}: Props) {
  return (
    <VarbListItemStyledNext>
      <DisplayNameCell {...feInfo} />
      <FirstValueEditorCell
        {...{
          className: "VarbListTable-extenderCell",
          valueEditorProps,
          ...feInfo,
        }}
      />
      <XBtnCell {...feInfo} />
    </VarbListItemStyledNext>
  );
}
