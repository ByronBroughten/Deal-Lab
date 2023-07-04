import React from "react";
import { VarbName } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { StrictExtract } from "../../../../sharedWithServer/utils/types";
import { FirstValueEditorCell } from "./FirstValueEditorCell";
import { NameEditorCell } from "./NameEditorCell";
import { VarbListItemStyledNext } from "./VarbListItemStyled";
import { XBtnCell } from "./XBtnCell";

type Name = StrictExtract<
  SectionName,
  "onetimeItem" | "periodicItem" | "numVarbItem"
>;
interface Props<SN extends Name> extends FeSectionInfo<SN> {
  valueEditorName: Extract<VarbName<SN>, "valueEditor" | "valuePeriodicEditor">;
  valueEditorProps?: { endAdornment?: React.ReactNode };
}
export function VarbListItemGeneric<SN extends Name>({
  valueEditorProps = {},
  valueEditorName,
  ...feInfo
}: Props<SN>) {
  return (
    <VarbListItemStyledNext>
      <NameEditorCell {...feInfo} />
      <FirstValueEditorCell
        {...{
          className: "VarbListTable-extenderCell",
          valueEditorProps,
          ...feInfo,
          valueEditorName,
        }}
      />
      <XBtnCell {...feInfo} />
    </VarbListItemStyledNext>
  );
}
