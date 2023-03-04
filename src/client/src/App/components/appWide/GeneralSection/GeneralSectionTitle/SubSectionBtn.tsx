import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { MainSectionBtnWide } from "./MainSectionBtnWide";

export const SubSectionBtn = styled(MainSectionBtnWide)`
  box-shadow: none;
  border: ${theme.borderStyle};
  font-size: ${theme.smallTitleSize};
`;
