import { SxProps } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import React from "react";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { PlainIconBtn } from "./../general/PlainIconBtn";

export type NavBtnProps = ButtonProps & {
  $isactive?: boolean;
  target?: string;
  icon?: React.ReactNode;
  text: React.ReactNode;
  sx?: SxProps;
  href?: string;
};
export function NavBtn({
  className,
  icon,
  text,
  $isactive,
  sx,
  ...rest
}: NavBtnProps) {
  return (
    <PlainIconBtn
      {...{
        className: `NavBtn-root ${className}`,
        sx: [
          {
            color: nativeTheme.primary.main,
            fontSize: 16,
            padding: `0 ${nativeTheme.s3}`,
            height: 70,
            "&:hover": {
              backgroundColor: nativeTheme.secondary.main,
              color: nativeTheme.light,
            },
            ...($isactive && {
              backgroundColor: nativeTheme.primary.main,
              color: nativeTheme.light,
            }),
          },
          ...arrSx(sx),
        ],
        disableRipple: true,
        ...rest,
        ...(text && {
          middle: text,
        }),
        ...(icon && {
          left: icon,
        }),
      }}
    />
  );
}
