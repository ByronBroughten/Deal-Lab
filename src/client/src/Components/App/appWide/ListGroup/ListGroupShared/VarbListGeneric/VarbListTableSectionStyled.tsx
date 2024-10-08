import { Box, SxProps } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { arrSx } from "../../../../../../modules/utils/mui";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import theme from "../../../../../../theme/Theme";
import { Column } from "../../../../../general/Column";
import { TextNext } from "../../../../../general/TextNext";
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
  sx?: SxProps;
  tableSx?: SxProps;
}

export function VarbListTableSectionStyled({
  headers,
  rows,
  addItem,
  rowCount,
  addItemBtnMiddle,
  className,
  varbListTotal,
  sx,
  tableSx,
}: Props) {
  const areRows = rowCount > 0;
  return (
    <Styled
      sx={[
        {
          width: "100%",
        },
        ...arrSx(sx),
      ]}
      className={`VarbListTableSectionStyled-root ${className ?? ""}`}
    >
      {!areRows && <AddItemBtn onClick={addItem} middle={addItemBtnMiddle} />}
      {areRows && (
        <div className="VarbListTable-tableContainer">
          {varbListTotal && (
            <Column
              sx={{
                justifyContent: "center",
                alignItems: "center",
                height: 30,
                ...nativeTheme.subSection.borderLines,
                borderTopLeftRadius: nativeTheme.br0,
                borderTopRightRadius: nativeTheme.br0,
                borderBottomWidth: 0,
              }}
            >
              <TextNext
                sx={{ color: nativeTheme["gray-700"], fontSize: 18 }}
              >{`Total: ${varbListTotal}`}</TextNext>
            </Column>
          )}
          <VarbListTableStyled sx={tableSx} headers={headers} rows={rows} />
          <AddItemBtn
            className={"TableAddItemBtn-root"}
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

const Styled = styled(Box)`
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
