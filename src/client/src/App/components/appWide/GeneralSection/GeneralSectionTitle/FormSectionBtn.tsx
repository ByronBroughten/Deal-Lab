import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { MainSectionBtnWide } from "./MainSectionBtnWide";

export const FormSectionBtn = styled(MainSectionBtnWide)`
  ${theme.sectionBorderChunk};
  font-size: ${theme.smallTitleSize};
  box-shadow: none;
  height: 90px;
`;
