import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { PlainIconBtn, PlainIconBtnProps } from "../../../general/PlainIconBtn";

export function MainSectionBtn(props: PlainIconBtnProps) {
  return <Styled {...props} />;
}
const Styled = styled(PlainIconBtn)`
  display: flex;
  align-items: center;
  border: none;
  background-color: ${theme.light};
  color: ${theme.primaryNext};
  padding: ${theme.s4};
  border-radius: ${theme.br0};
  box-shadow: ${theme.boxShadow1};
  font-size: ${theme.titleSize};

  :hover {
    background-color: ${theme.secondary};
    color: ${theme.light};
    box-shadow: none;
  }

  .MainSectionTitleBtn-icon {
    display: flex;
    align-items: center;
    margin-left: ${theme.s3};
  }
`;
