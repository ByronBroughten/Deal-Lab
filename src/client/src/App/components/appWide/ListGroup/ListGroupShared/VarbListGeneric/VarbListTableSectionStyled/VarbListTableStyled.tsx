import React from "react";
import styled from "styled-components";
import theme from "../../../../../../theme/Theme";

interface Props {
  className?: string;
  headers: React.ReactNode;
  rows: React.ReactNode;
}
export function VarbListTableStyled({ className, headers, rows }: Props) {
  return (
    <Styled className={`VarbListTable-root ${className ?? ""}`}>
      <thead>{headers}</thead>
      <tbody>{rows}</tbody>
    </Styled>
  );
}

const Styled = styled.table`
  border: ${theme.borderStyle};
  width: 100%;
  border-collapse: collapse;

  th {
    border-bottom: solid 1px ${theme.primaryBorder};
    padding-top: ${theme.s2};
    white-space: nowrap;
    text-align: left;
    vertical-align: bottom;
    font-weight: 400;
    line-height: 1rem;
    font-size: 1rem;
    color: ${theme.primaryNext};
  }

  th.VarbListTable-extenderHeader,
  td.VarbListTable-extenderCell {
    width: 100%;
  }

  th,
  td {
    width: 1px;
    padding-left: ${theme.s25};
    padding-right: ${theme.s25};
  }

  tbody {
    tr {
      :not(:last-child) {
        border-bottom: 1px solid ${theme.primaryBorder};
      }
    }
  }

  th.VarbListTable-nameHeader,
  td.VarbListTable-nameCell {
    background: ${theme["gray-200"]};
  }

  th.VarbListTable-firstContentHeader,
  td.VarbListTable-firstContentCell {
    border-left: 1px solid ${theme.primaryBorder};
  }
`;
