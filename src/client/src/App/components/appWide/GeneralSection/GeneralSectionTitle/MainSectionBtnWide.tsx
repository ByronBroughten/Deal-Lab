import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import { MainSectionBtn } from "./MainSectionBtn";

interface Props extends StandardBtnProps {
  text: React.ReactNode;
  icon?: React.ReactElement;
}
export function MainSectionBtnWide({ text, icon }: Props) {
  return (
    <Styled
      {...{
        middle: text,
        right: icon,
      }}
    />
  );
}
const Styled = styled(MainSectionBtn)`
  height: 80px;
  width: 100%;

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
