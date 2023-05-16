import { Box, styled, SxProps } from "@mui/material";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import { PlainIconBtn } from "../../general/PlainIconBtn";

export interface MainSectionProps {
  sx?: SxProps;
  children: React.ReactNode;
  className?: string;
}
export function MainSection({ sx, ...rest }: MainSectionProps) {
  return (
    <Box
      {...{
        ...rest,
        sx: [nativeTheme.mainSection, ...arrSx(sx)],
      }}
    />
  );
}

export const MainSectionBtn = styled(PlainIconBtn, {
  overridesResolver: (props, styles) => [
    styles.root,
    props.styleDisabled && nativeTheme.disabledBtn,
  ],
})({
  ...nativeTheme.mainSection,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: nativeTheme.light,
  fontSize: nativeTheme.chunkTitleFs,
  color: nativeTheme.primary.main,
  "&:hover": {
    border: `solid 1px ${nativeTheme.primary.main}`,
    backgroundColor: nativeTheme.secondary.main,
    color: nativeTheme.light,
    boxShadow: "none",
  },
});
