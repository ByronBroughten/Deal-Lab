import { styled } from "@mui/material";
import { nativeTheme } from "../../../theme/nativeTheme";

export const FormSection = styled("div")({
  display: "flex",
  padding: nativeTheme.s2,
  paddingTop: nativeTheme.s4,
  paddingBottom: nativeTheme.s45,
  borderWidth: 0,
  ...nativeTheme.formSection,
});
