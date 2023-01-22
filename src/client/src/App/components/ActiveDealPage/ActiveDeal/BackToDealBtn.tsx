import { RiArrowGoBackLine } from "react-icons/ri";
import styled from "styled-components";
import theme from "../../../theme/Theme";
import { StyledIconBtn } from "../../appWide/StyledIconBtn";
import { StandardBtnProps } from "../../general/StandardProps";

export function BackToDealBtn(props: StandardBtnProps) {
  return (
    <Styled
      {...{
        ...props,
        middle: "Back to Deal",
        right: <RiArrowGoBackLine />,
      }}
    />
  );
}

const Styled = styled(StyledIconBtn)`
  font-size: ${theme.infoSize};
  padding: ${theme.s1} ${theme.s3};
`;
