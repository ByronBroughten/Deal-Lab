import styled from "styled-components";
import theme from "../../../../../theme/Theme";

export const VarbListMenuStyled = styled.div`
  width: 100%;
  .VarbListMenu-titleRow {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }
  .VarbListMenu-titleRowLeft {
    display: flex;
    flex: 1;
  }

  .VarbListMenu-title {
    .DraftEditor-root {
      min-width: 120px;
    }
  }
  .VarbList-total {
    margin-left: ${theme.s2};
    margin-top: ${theme.s2};
  }
`;
