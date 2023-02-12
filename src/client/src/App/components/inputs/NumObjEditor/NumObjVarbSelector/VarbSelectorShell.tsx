import React from "react";
import styled from "styled-components";
import ccs from "../../../../theme/cssChunks";
import theme from "../../../../theme/Theme";

type Props = {
  className?: string;
  children: React.ReactNode;
};
export function VarbSelectorShell({ children, className }: Props) {
  return <Styled className={`${className ?? ""}`}>{children}</Styled>;
}

const Styled = styled.div`
  display: block;
  z-index: 2; // it should beat editor title labels
  background: ${theme.light};
  border: 1px solid ${theme.primary.light};
  border-radius: ${theme.br0};
  border-top-left-radius: 0;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  ${ccs.dropdown.scrollbar};
`;
