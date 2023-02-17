import React from "react";
import { StyleSheet, View } from "react-native";
import styled from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import theme from "../../../../../theme/Theme";
import { AddItemBtn } from "../AddItemBtn";

interface Props {
  className?: string;
  addItem: () => void;
  headers: React.ReactNode;
  rows: React.ReactNode;
  rowCount: number;
  addItemBtnMiddle?: React.ReactNode;
  varbListTotal?: React.ReactNode;
}

export function VarbListTableStyled({
  headers,
  rows,
  addItem,
  rowCount,
  addItemBtnMiddle,
  className,
  varbListTotal,
}: Props) {
  const areRows = rowCount > 0;
  const theme = nativeTheme;

  const totalStyles = StyleSheet.flatten(theme.subSection.borderLines);
  return (
    <Styled className={`VarbListTableStyled-root ${className ?? ""}`}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 30,
          ...totalStyles,
          borderTopLeftRadius: nativeTheme.br0,
          borderTopRightRadius: nativeTheme.br0,
        }}
      >
        {varbListTotal && (
          <span className="VarbList-total">{`Total: ${varbListTotal}`}</span>
        )}
      </View>
      {!areRows && (
        <AddItemBtn
          onClick={addItem}
          middle={addItemBtnMiddle}
          className="noTable"
        />
      )}
      {areRows && (
        <div className="VarbListTable-tableContainer">
          <table className="VarbListTable-table">
            <thead>{headers}</thead>
            <tbody>{rows}</tbody>
          </table>
          <AddItemBtn
            middle={addItemBtnMiddle}
            onClick={addItem}
            className="VarbListTable-addItemBtn tableBottom"
          />
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  /* display: flex;
  justify-content: center; */
  width: 100%;

  .VarbList-totalDiv {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    border: ${theme.borderStyle};
    border-top-right-radius: ${theme.br0};
    border-top-left-radius: ${theme.br0};
  }

  .VarbListTable-tableContainer {
    display: inline-block;
    width: 100%;
    border-radius: ${theme.br0};
  }
  .VarbListTable-table {
    width: 100%;
    ${ccs.listTable.main()}
    border: ${theme.borderStyle};
    border-top: none;
  }
  td {
    width: 1px;
  }
  .VarbListTable-lastHeader {
    width: 100%;
  }
  .VarbListTable-fillerCell {
  }

  .XBtn {
    visibility: hidden;
  }
  tr {
    :hover {
      .XBtn {
        visibility: visible;
      }
    }
  }

  th {
    text-align: left;
    white-space: nowrap;
    color: ${theme.primaryNext};
  }

  th.VarbListTable-nameHeader,
  td.VarbListTable-nameCell {
    background: ${theme["gray-200"]};
  }

  th.VarbListTable-firstContentHeader,
  td.VarbListTable-firstContentCell {
    border-left: 1px solid ${theme.primaryBorder};
  }

  .VarbListTable-addItemBtn {
    border-top: none;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
`;
