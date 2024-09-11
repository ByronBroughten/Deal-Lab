import React from "react";
import { arrSx } from "../../modules/utils/mui";
import { Column } from "./Column";
import { MuiStandardProps } from "./StandardProps";

interface Props {
  RelativeProps?: MuiStandardProps;
  AbsoluteProps?: MuiStandardProps;
  children: React.ReactNode;
}
export function DropdownContainer({
  RelativeProps,
  AbsoluteProps,
  children,
}: Props) {
  return (
    <Column
      {...{
        ...RelativeProps,
        sx: [...arrSx(RelativeProps?.sx), { position: "relative" }],
      }}
    >
      <Column
        {...{
          ...AbsoluteProps,
          style: [...arrSx(AbsoluteProps?.sx), { position: "absolute" }],
        }}
      >
        {children}
      </Column>
    </Column>
  );
}
