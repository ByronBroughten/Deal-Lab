import { Box, SxProps } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import theme from "../../../../../../../theme/Theme";
import { arrSx } from "../../../../../../../utils/mui";

interface Props {
  className?: string;
  headers: React.ReactNode;
  rows: React.ReactNode;
  sx?: SxProps;
}
export function VarbListTableStyled({ className, headers, rows, sx }: Props) {
  return (
    <Styled
      className={`VarbListTable-root ${className ?? ""}`}
      component={"table"}
      sx={[
        {
          border: theme.borderStyle,
          width: "100%",
          borderCollapse: "collapse",
        },
        ...arrSx(sx),
      ]}
    >
      <thead>{headers}</thead>
      <tbody>{rows}</tbody>
    </Styled>
  );
}

const Styled = styled(Box)`
  th {
    border-bottom: solid 1px ${theme.primaryBorder};
    padding-top: ${theme.s2};
    white-space: nowrap;
    text-align: left;
    vertical-align: bottom;
    font-weight: 400;
    font-size: ${nativeTheme.fs20};
    color: ${theme.primaryNext};
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
`;
