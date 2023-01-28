import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { StandardProps } from "../../../general/StandardProps";

export function VarbListStyled({ children, className }: StandardProps) {
  return (
    <Styled className={`VarbListStyled-root ${className ?? ""}`}>
      <div className="VarbListStyled-viewable">{children}</div>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: flex-start;
  .VarbListStyled-viewable {
    flex-wrap: nowrap;
    min-width: 230px;

    display: inline-block;
    border: solid 1px ${theme.primaryBorder};
    background: ${theme.light};
    border-radius: ${theme.br0};
    padding: ${theme.sectionPadding};
  }
  .VarbListMenu-root {
    margin-bottom: ${theme.s2};
  }
  .VarbListTable-root {
    margin-top: ${theme.s2};
  }
`;
