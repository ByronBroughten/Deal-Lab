import styled from "styled-components";
import theme from "../../../theme/Theme";
import { HollowBtn } from "../../appWide/HollowBtn";

export const FinishBtn = styled(HollowBtn)`
  height: 50px;
  width: 100%;
  margin: ${theme.flexElementSpacing};
  margin-top: ${theme.s3};
  font-size: ${theme.titleSize};
`;
