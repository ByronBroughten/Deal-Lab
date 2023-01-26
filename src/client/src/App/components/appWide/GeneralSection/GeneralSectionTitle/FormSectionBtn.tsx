import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { MainSectionBtn } from "./MainSectionBtn";

export const FormSectionBtn = styled(MainSectionBtn)`
  ${theme.sectionBorderChunk};
  font-size: ${theme.smallTitleSize};
  box-shadow: none;
  height: 90px;
`;
