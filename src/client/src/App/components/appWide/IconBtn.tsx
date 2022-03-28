import { Button } from "@material-ui/core";
import { StandardBtnProps } from "../general/StandardProps";
import styled from "styled-components";
import { rem } from "polished";
import theme from "../../theme/Theme";

export function IconBtn(props: StandardBtnProps) {
  return <Styled {...props} />;
}

const Styled = styled(Button)`
  font-size: ${rem("29px")};
  color: ${theme["gray-800"]};
  border-radius: 50%;
  padding: ${theme.s2};
`;
