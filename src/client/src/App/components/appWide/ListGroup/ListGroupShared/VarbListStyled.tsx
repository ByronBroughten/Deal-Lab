import { Box, SxProps } from "@mui/material";
import theme from "../../../../theme/Theme";
import { arrSx } from "../../../../utils/mui";
import { StandardProps } from "../../../general/StandardProps";

export function VarbListStyled({
  children,
  className,
  sx,
  viewableSx,
}: StandardProps & { sx?: SxProps; viewableSx?: SxProps }) {
  return (
    <Box
      sx={[
        {
          display: "flex",
          alignItems: "flex-start",
        },
        ...arrSx(sx),
      ]}
      className={`VarbListStyled-root ${className ?? ""}`}
    >
      <Box
        sx={[
          {
            minWidth: 230,
            display: "inline-block",
            border: `solid 1px ${theme.primaryBorder}`,
            background: theme.light,
            borderRadius: theme.br0,
            padding: theme.sectionPadding,
            "&.VarbListMenu-root": {
              marginBottom: theme.s3,
            },
          },
          ...arrSx(viewableSx),
        ]}
        className="VarbListStyled-viewable"
      >
        {children}
      </Box>
    </Box>
  );
}
