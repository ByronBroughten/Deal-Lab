import { CSSProperties } from "@material-ui/core/styles/withStyles";
import React, { ChangeEvent, ReactNode } from "react";

export type StandardProps = { className?: string; children?: React.ReactNode };
export type StandardBtnProps = StandardProps & {
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
};

export interface NativeStandardProps {
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export interface NativeBtnProps extends NativeStandardProps {
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}

export type StandardSelectProps = StandardProps & {
  name: string;
  value: string;
  onChange:
    | ((
        event: ChangeEvent<{
          name?: string | undefined;
          value: unknown;
        }>,
        child: ReactNode
      ) => void)
    | undefined;
  className?: string;
};
