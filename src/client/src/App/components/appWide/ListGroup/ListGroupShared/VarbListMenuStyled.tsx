import styled from "styled-components";
import theme from "../../../../theme/Theme";

export const VarbListMenuStyled = styled.div`
  .VarbListMenu-titleRow {
    display: flex;
    justify-content: space-between;
  }
  .VarbListGeneric-title {
    .MuiInputBase-root {
      min-width: 5rem;
    }
  }
  .VarbListMenu-titleRowLeft {
    display: flex;
  }
  .AdditiveList-total {
    margin-left: ${theme.s2};
    margin-top: ${theme.s2};
  }
  .ActionBtnLoad-root {
    margin-left: ${theme.s25};
    width: 75px;
    height: 25px;
    border-radius: ${theme.br0};
    box-shadow: none;

    background: none;
    color: ${theme.primaryNext};
    :hover {
      background: ${theme.secondary};
      color: ${theme.light};
    }

    .LabeledIconBtn-iconSpan {
      min-width: 25px;
    }
    .LabeledIconBtn-label {
      margin-left: ${theme.s2};
    }
  }
`;