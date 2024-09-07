import { styled } from "@mui/material";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { MainSectionBtn } from "../MainSection";

export const SubSectionBtn = styled(MainSectionBtn)({
  ...nativeTheme.subSection.borderLines,
  fontSize: nativeTheme.inputLabel.fontSize,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: nativeTheme.secondary,
    color: nativeTheme.light,
    boxShadow: "none",
  },
});
