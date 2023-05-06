import { styled } from "@mui/material";
import { nativeTheme } from "../../../theme/nativeTheme";
import { MainSection } from "./MainSection";

export const MainSectionInner = styled(MainSection)({
  boxShadow: "none",
  ...nativeTheme.subSection.borderLines,
});
