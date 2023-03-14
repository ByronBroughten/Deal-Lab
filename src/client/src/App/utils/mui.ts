import { SelectChangeEvent } from "@mui/material";

export type MuiSelectOnChange = (
  event: SelectChangeEvent<string>,
  child: React.ReactNode
) => void;
