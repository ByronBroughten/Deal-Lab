import { Box, SxProps } from "@mui/material";
import styled from "styled-components";
import { nativeTheme } from "../../../theme/nativeTheme";
import theme from "../../../theme/Theme";

interface Props {
  sx?: SxProps;
  children: React.ReactNode;
  className?: string;
}
export function MainSection({ className, sx, ...rest }: Props) {
  return (
    <Styled
      className={`${className ?? ""}`}
      {...rest}
      sx={{
        background: nativeTheme.light,
        padding: nativeTheme.s4,
        borderRadius: nativeTheme.br0,
        boxShadow: theme.boxShadow1,
        ...sx,
      }}
    />
  );
}

const Styled = styled(Box)`
  .MainSectionTitleRow-xBtn {
    visibility: hidden;
  }
`;
