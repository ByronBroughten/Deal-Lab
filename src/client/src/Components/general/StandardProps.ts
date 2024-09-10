import { SxProps } from "@mui/material";
import React from "react";
import { MuiSelectOnChange } from "../../modules/utils/mui";

export type StandardProps = { className?: string; children?: React.ReactNode };
export type StandardBtnProps = StandardProps & {
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
};

export interface MuiStandardProps {
  className?: string;
  children?: React.ReactNode;
  sx?: SxProps;
}

export interface MuiBtnProps extends MuiStandardProps {
  onClick?: () => void;
  disabled?: boolean;
}

export type StandardSelectProps = StandardProps & {
  name: string;
  value: string;
  onChange: MuiSelectOnChange | undefined;
  className?: string;
};
