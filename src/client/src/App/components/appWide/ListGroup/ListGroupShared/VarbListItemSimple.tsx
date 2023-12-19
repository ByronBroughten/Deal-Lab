import { SxProps } from "@mui/material";
import {
  FeSectionInfo,
  FeVI,
} from "../../../../../sharedWithServer/SectionInfo/FeInfo";
import { SectionName } from "../../../../../sharedWithServer/sectionVarbsConfig/SectionName";
import { StrictExtract } from "../../../../../sharedWithServer/utils/types";
import { FirstValueEditorCell } from "./FirstValueEditorCell";
import { NameEditorCell } from "./NameEditorCell";
import { VarbListItemStyled } from "./VarbListItemStyled";
import { XBtnCell } from "./XBtnCell";

type Name = StrictExtract<
  SectionName,
  "onetimeItem" | "periodicEditor" | "numVarbItem"
>;
interface Props<SN extends Name> extends FeVI<SN> {
  nameEditorProps?: FeSectionInfo;
  valueEditorProps?: {
    startAdornment?: JSX.Element | string;
    endAdornment?: JSX.Element | string;
  };
  sx?: SxProps;
}
export function VarbListItemSimple<SN extends Name>({
  valueEditorProps = {},
  nameEditorProps,
  sx,
  varbName,
  ...feInfo
}: Props<SN>) {
  const nameProps = nameEditorProps ?? feInfo;
  return (
    <VarbListItemStyled sx={sx}>
      <NameEditorCell {...nameProps} />
      <FirstValueEditorCell
        {...{
          className: "VarbListItemSimple-editorCell",
          ...valueEditorProps,
          ...feInfo,
          varbName,
        }}
      />
      <XBtnCell {...feInfo} />
    </VarbListItemStyled>
  );
}
