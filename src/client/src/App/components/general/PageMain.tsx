import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardProps } from "./StandardProps";

type Props = StandardProps;
export function PageMainFn({ children, ...rest }: Props) {
  return <PageMain {...rest}>{children}</PageMain>;
}

export const PageMain = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  z-index: 5;
  background: ${theme.light};
  overflow-x: visible;
`;
