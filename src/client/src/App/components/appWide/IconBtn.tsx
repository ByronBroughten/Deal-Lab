import { Button } from "@mui/material";
import { rem } from "polished";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";

export function IconBtn(props: StandardBtnProps) {
  return <Styled {...props} />;
}

const Styled = styled(Button)`
  font-size: ${rem("29px")};
  color: ${theme["gray-800"]};
  border-radius: 50%;
  padding: ${theme.s2};
  line-height: 1rem;
`;
