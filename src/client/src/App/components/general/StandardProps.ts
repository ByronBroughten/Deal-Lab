import { SxProps } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createTypography";
import React from "react";
import { ViewStyle } from "react-native";
import { MuiSelectOnChange } from "../../utils/mui";

export type StandardProps = { className?: string; children?: React.ReactNode };
export type StandardBtnProps = StandardProps & {
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
};

export interface NativeViewProps {
  style: ViewStyle;
}

export interface MuiStandardProps {
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export interface MuiStandardPropsNext {
  className?: string;
  children?: React.ReactNode;
  sx?: SxProps;
}

export interface MuiBtnPropsNext extends MuiStandardPropsNext {
  onClick?: () => void;
  disabled?: boolean;
}

export interface MuiBtnProps extends MuiStandardProps {
  sx?: SxProps;
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}

export interface MuiBtnPropsNext {
  sx?: SxProps;
  onClick?: () => void;
  disabled?: boolean;
}

export type StandardSelectProps = StandardProps & {
  name: string;
  value: string;
  onChange: MuiSelectOnChange | undefined;
  className?: string;
};
