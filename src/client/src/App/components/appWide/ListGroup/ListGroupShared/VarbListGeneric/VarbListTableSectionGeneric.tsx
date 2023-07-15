import { SxProps } from "@mui/material";
import React, { Children } from "react";
import { StandardProps } from "../../../../general/StandardProps";
import { VarbListTableSectionStyled } from "./VarbListTableSectionStyled";

interface Props extends StandardProps {
  addItem: () => void;
  headers: React.ReactNode;
  varbListTotal?: React.ReactNode;
  sx?: SxProps;
  tableSx?: SxProps;
}

export function VarbListTableSectionGeneric({ children, ...rest }: Props) {
  return (
    <VarbListTableSectionStyled
      {...rest}
      rows={children}
      rowCount={Children.toArray(children).length}
    />
  );
}
