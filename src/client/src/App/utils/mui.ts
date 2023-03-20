import { SelectChangeEvent, SxProps } from "@mui/material";

export type MuiSelectOnChange = (
  event: SelectChangeEvent<string>,
  child: React.ReactNode
) => void;

export const muiS = {
  sxProps: <T extends SxProps>(props: T) => props,
};

export const sxProps = <T extends SxProps>(props: T) => props;
export const arrSx = (sx?: SxProps) => (Array.isArray(sx) ? sx : [sx]);
