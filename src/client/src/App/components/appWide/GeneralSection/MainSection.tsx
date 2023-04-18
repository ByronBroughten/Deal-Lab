import { Box, SxProps } from "@mui/material";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import { PlainIconBtn } from "../../general/PlainIconBtn";
import { MuiBtnPropsNext } from "../../general/StandardProps";

interface Props {
  sx?: SxProps;
  children: React.ReactNode;
  className?: string;
}
export function MainSection({ sx, ...rest }: Props) {
  return (
    <Box
      {...{
        ...rest,
        sx: [nativeTheme.mainSection, ...arrSx(sx)],
      }}
    />
  );
}

interface BtnProps extends MuiBtnPropsNext {
  styleDisabled?: boolean;
}
export function MainSectionBtn({ sx, styleDisabled, ...rest }: BtnProps) {
  return (
    <PlainIconBtn
      {...{
        ...rest,
        sx: [
          {
            ...nativeTheme.mainSection,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: nativeTheme.light,
            fontSize: nativeTheme.fs20,
            color: nativeTheme.primary.main,
            "&:hover": {
              border: `solid 1px ${nativeTheme.primary.main}`,
              backgroundColor: nativeTheme.secondary.main,
              color: nativeTheme.light,
              boxShadow: "none",
            },
            ...(styleDisabled && nativeTheme.disabledBtn),
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
