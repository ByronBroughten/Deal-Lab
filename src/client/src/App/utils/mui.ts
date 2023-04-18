import { SelectChangeEvent, SxProps } from "@mui/material";
import React from "react";

export type MuiSelectOnChange = (
  event: SelectChangeEvent<string>,
  child: React.ReactNode
) => void;

export const muiS = {
  sxProps: <T extends SxProps>(props: T) => props,
};

export const sxProps = <T extends SxProps>(props: T) => props;
export const arrSx = (sx?: SxProps) => (Array.isArray(sx) ? sx : [sx]);

function toMemo<Sx extends SxProps | undefined>(sx?: Sx): [Sx, string[]] {
  if (!sx) return [sx, []] as [Sx, string[]];
  const arr = arrSx(sx);
  const props = arr.reduce((final, single) => {
    return {
      ...single,
      ...final,
    };
  }, {} as SxProps);
  const deps = JSON.stringify(props);
  return [props, [deps]];
}

export function useMemoSx<Sx extends SxProps | undefined>(sx?: Sx): Sx {
  const [msx, arr] = toMemo(sx);
  return React.useMemo(() => msx, arr);
}
