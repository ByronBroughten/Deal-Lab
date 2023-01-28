import React from "react";
import styled from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import { AddItemBtn } from "../AddItemBtn";

interface Props {
  className?: string;
  addItem: () => void;
  headers: React.ReactNode;
  rows: React.ReactNode;
  rowCount: number;
}

export function VarbListTableStyled({
  headers,
  rows,
  addItem,
  rowCount,
}: Props) {
  const areRows = rowCount > 0;
  return (
    <Styled className="VarbListTable-root">
      {!areRows && <AddItemBtn onClick={addItem} className="noTable" />}
      {areRows && (
        <div className="VarbListTable-tableContainer">
          <table className="VarbListTable-table">
            <thead>
              <tr>{headers}</tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
          <AddItemBtn
            onClick={addItem}
            className="VarbListTable-addItemBtn tableBottom"
          />
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  .VarbListTable-tableContainer {
    display: inline-block;
    width: 100%;
  }
  .VarbListTable-table {
    ${ccs.listTable.main()}
    min-width: 230px;
    border: ${theme.borderStyle};
    border-top-right-radius: ${theme.br0};
    border-top-left-radius: ${theme.br0};
  }
  .VarbListTable-fillerHeader {
    width: 100%;
  }

  th {
    text-align: left;
  }

  th.VarbListTable-nameHeader,
  td.VarbListTable-nameCell {
    background: ${theme["gray-200"]};
  }

  th.VarbListTable-firstContentHeader,
  td.VarbListTable-firstContentCell {
    border-left: 1px solid ${theme.primaryBorder};
  }

  .VarbListTable-addItemBtn.tableBottom {
    border-top: none;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
`;
