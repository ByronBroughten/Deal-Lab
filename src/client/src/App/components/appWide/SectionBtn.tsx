import styled from "styled-components";
import theme from "../../theme/Theme";
import { HollowBtn, HollowBtnProps } from "./HollowBtn";

export function SectionBtn({ className, ...rest }: HollowBtnProps) {
  return <Styled className={`SectionBtn-root ${className ?? ""}`} {...rest} />;
}

const Styled = styled(HollowBtn)`
  border: solid 1px ${theme.primaryBorder};
  z-index: 0;

  :hover {
    border: solid 1px ${theme.primaryNext};
  }
`;
