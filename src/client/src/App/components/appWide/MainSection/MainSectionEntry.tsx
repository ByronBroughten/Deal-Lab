import styled from "styled-components";
import theme from "../../../theme/Theme";

export default styled.div.attrs(({ className = "", ...rest }) => ({
  className: "MainSection-entry " + className,
  ...rest,
}))`
  padding: ${theme.s3};
  .MainEntryTitleRow-root {
  }
  .ListGroup-root {
    margin: ${theme.s2};
  }
  .toggle-view-btn {
    color: ${theme["gray-700"]};
  }
`;
