import { Link } from "react-router-dom";
import styled from "styled-components";
import { StandardProps } from "../../../general/StandardProps";

interface Props extends StandardProps {
  to: string;
}
export function DomLink(props: Props) {
  return <Styled {...props} />;
}
const Styled = styled(Link)`
  display: inherit;
  align-items: inherit;
  height: inherit;
  text-decoration: none;
`;
