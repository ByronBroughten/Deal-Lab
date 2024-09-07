import { RiArrowGoBackLine } from "react-icons/ri";
import styled from "styled-components";
import theme from "../../../../../theme/Theme";
import { StandardBtnProps } from "../../../../general/StandardProps";
import { StyledIconBtn } from "../../../appWide/StyledIconBtn";

interface Props extends StandardBtnProps {
  backToWhat: string;
}
export function BackToSectionBtn({ backToWhat, ...props }: Props) {
  return (
    <Styled
      {...{
        ...props,
        middle: backToWhat,
        right: <RiArrowGoBackLine />,
      }}
    />
  );
}

const Styled = styled(StyledIconBtn)`
  font-size: ${theme.infoSize};
  padding: 0 ${theme.s3};
  white-space: nowrap;
`;
