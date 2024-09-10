import { Box, SxProps } from "@mui/material";
import { arrSx } from "../../../../../modules/utils/mui";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { useIsDevices } from "../../../customHooks/useMediaQueries";

interface Props {
  children: React.ReactNode;
  className?: string;
  sx?: SxProps;
}

export function VarbListItemStyled({ sx, className, children }: Props) {
  const { isDesktop } = useIsDevices();
  return (
    <Box
      component={"tr"}
      sx={[
        {
          "& td": {
            paddingTop: nativeTheme.s15,
            paddingBottom: nativeTheme.s15,
          },
          "& .DraftTextField-root": {
            minWidth: "40px",
          },
          ...(isDesktop && {
            "& .XBtn": {
              visiblity: "hidden",
            },
            "&:hover": {
              "& .XBtn": {
                visibility: "visible",
              },
            },
          }),
        },
        ...arrSx(sx),
      ]}
      className={`VarbListItem-root ${className ?? ""}`}
    >
      {children}
    </Box>
  );
}
