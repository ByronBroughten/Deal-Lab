import styled from "styled-components";
import theme from "../../../theme/Theme";
import { HollowBtn } from "../../appWide/HollowBtn";
import { PlainIconBtnProps } from "../../general/PlainIconBtn";

type Props = PlainIconBtnProps;
export function MainSectionLargeEditBtn(props: Props) {
  return <Styled {...props} />;
}

const Styled = styled(HollowBtn)`
  margin-left: ${theme.s3};
  width: 100%;
  height: 45px;
  font-size: ${theme.infoSize};
  border: ${theme.borderStyle};
`;
