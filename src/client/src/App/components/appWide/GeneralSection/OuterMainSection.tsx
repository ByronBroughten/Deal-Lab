import styled from "styled-components";
import theme from "../../../theme/Theme";
import { MainSection } from "./MainSection";

export const OuterMainSection = styled(MainSection)`
  border-top-right-radius: 0;
  min-height: calc(96.5vh - ${theme.navBar.height});
  padding-bottom: 0;
  box-shadow: none;
  background: ${theme.mainBackground};
  @media (max-width: ${theme.mediaPhone}) {
    padding-left: ${theme.s15};
    padding-right: ${theme.s15};
  }
`;
