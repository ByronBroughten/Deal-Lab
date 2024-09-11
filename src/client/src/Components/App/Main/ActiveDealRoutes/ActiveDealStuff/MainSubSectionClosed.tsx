import { SxProps } from "@mui/material";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { Column } from "../../../../general/Column";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";

type Props = {
  sx?: SxProps;
  className?: string;
  titleRow: React.ReactNode;
  detailsSection?: React.ReactNode;
};

export function MainSubSectionClosed({
  sx,
  titleRow,
  detailsSection,
  className,
}: Props) {
  return (
    <MainSection
      className={`${className ?? ""}`}
      sx={{
        padding: nativeTheme.s25,
        paddingLeft: nativeTheme.mainSection.padding,
        ...sx,
      }}
    >
      <div>{titleRow}</div>
      {detailsSection && (
        <Column sx={{ marginTop: nativeTheme.s25 }}>{detailsSection}</Column>
      )}
    </MainSection>
  );
}
