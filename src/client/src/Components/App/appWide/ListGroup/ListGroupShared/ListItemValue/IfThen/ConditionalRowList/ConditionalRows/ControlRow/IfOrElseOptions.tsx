import { MenuItem } from "@mui/material";

export const ifOptions = ["if", "or if", "then"];
export const orElseOptions = ["or else", ""];

export const IfOptions = () =>
  ifOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));

export const OrElseOptions = () =>
  orElseOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
