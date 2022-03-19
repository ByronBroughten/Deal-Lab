import styled from "styled-components";
import theme from "../../../theme/Theme";

const MainSectionEntry = styled.div.attrs(({ className = "", ...rest }) => ({
  className: "MainSection-entry " + className,
  ...rest,
}))`
  padding: ${theme.s3};

  .toggle-view-btn {
    color: ${theme["gray-700"]};
  }
`;

export default MainSectionEntry;
