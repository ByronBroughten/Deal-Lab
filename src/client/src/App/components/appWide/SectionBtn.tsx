import styled from "styled-components";
import theme from "../../theme/Theme";
import { PlainIconBtnProps } from "../general/PlainIconBtn";
import { HollowBtn } from "./HollowBtn";

export function SectionBtn({ className, ...rest }: PlainIconBtnProps) {
  return <Styled className={`SectionBtn-root ${className ?? ""}`} {...rest} />;
}

const Styled = styled(HollowBtn)`
  border: solid 1px ${theme.primaryBorder};
  :hover {
    border: solid 1px ${theme.primaryNext};
  }
`;
