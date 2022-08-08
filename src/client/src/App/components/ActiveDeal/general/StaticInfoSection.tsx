import styled from "styled-components";
import theme from "../../../theme/Theme";

export default styled.div`
  padding: ${theme.s3} ${theme.s3};
  .ListGroup-root {
    margin: ${theme.s2};
    .SubSectionGroup-viewable {
      background: ${theme["gray-300"]};
      .LabeledVarb-label {
        background: ${theme["gray-300"]};
      }
    }
  }
`;
