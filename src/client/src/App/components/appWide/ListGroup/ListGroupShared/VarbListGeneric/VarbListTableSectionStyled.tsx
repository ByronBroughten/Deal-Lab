import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import theme from "../../../../../theme/Theme";
import { AddItemBtn } from "../AddItemBtn";
import { VarbListTableStyled } from "./VarbListTableSectionStyled/VarbListTableStyled";

interface Props {
  className?: string;
  addItem: () => void;
  headers: React.ReactNode;
  rows: React.ReactNode;
  rowCount: number;
  addItemBtnMiddle?: React.ReactNode;
  varbListTotal?: React.ReactNode;
}

export function VarbListTableSectionStyled({
  headers,
  rows,
  addItem,
  rowCount,
  addItemBtnMiddle,
  className,
  varbListTotal,
}: Props) {
  const areRows = rowCount > 0;
  return (
    <Styled className={`VarbListTableSectionStyled-root ${className ?? ""}`}>
      {!areRows && <AddItemBtn onClick={addItem} middle={addItemBtnMiddle} />}
      {areRows && (
        <div className="VarbListTable-tableContainer">
          {varbListTotal && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 30,
                ...nativeTheme.subSection.borderLines,
                borderTopLeftRadius: nativeTheme.br0,
                borderTopRightRadius: nativeTheme.br0,
                borderBottomWidth: 0,
              }}
            >
              <Text
                style={{ color: nativeTheme["gray-700"], fontSize: 15 }}
              >{`Total: ${varbListTotal}`}</Text>
            </View>
          )}
          <VarbListTableStyled headers={headers} rows={rows} />
          <AddItemBtn
            sx={{
              borderTopWidth: 0,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
            }}
            onClick={addItem}
            middle={addItemBtnMiddle}
          />
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div`
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
`;