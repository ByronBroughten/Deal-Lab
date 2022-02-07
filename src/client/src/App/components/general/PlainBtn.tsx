import { Button } from "@material-ui/core";
import styled from "styled-components";

type Props = any;
export default function PlainBtn({ children, ...rest }: Props) {
  return <Styled {...rest}>{children}</Styled>;
}

const Styled = styled(Button)`
  background: none;
  border: none;
  border-radius: 0;
  :hover {
    background: none;
  }
`;
