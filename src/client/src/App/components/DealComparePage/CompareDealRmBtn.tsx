import { SxProps } from "@mui/material";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { nativeTheme } from "../../theme/nativeTheme";
import { RemoveSectionXBtn } from "../appWide/RemoveSectionXBtn";

interface Props extends FeSectionInfo {
  sx?: SxProps;
}
export function CompareDealRmBtn({ sx, ...rest }: Props) {
  return (
    <RemoveSectionXBtn
      {...{
        ...rest,
        sx: {
          backgroundColor: nativeTheme.light,
          borderRadius: nativeTheme.muiBr0,
          ...nativeTheme.subSection.borderLines,
          "&:hover": {
            borderColor: nativeTheme.notice.light,
            backgroundColor: nativeTheme.notice.main,
            color: nativeTheme.light,
          },
          ...sx,
        },
      }}
    />
  );
}
