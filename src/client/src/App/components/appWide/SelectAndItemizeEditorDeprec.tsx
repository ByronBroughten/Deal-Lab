import { Box } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { EditSectionBtn } from "./EditSectionBtn";
import { ModalSection } from "./ModalSection";
import { SelectEditorDepric, SelectEditorProps } from "./SelectEditorDepric";

export interface SelectAndItemizeEditorProps extends SelectEditorProps {
  total: string;
  itemizeValue: string;
  itemsComponent: React.ReactNode;
  itemizedModalTitle: React.ReactNode;
}

export function SelectAndItemizeEditorDepric({
  className,
  total,
  itemsComponent,
  onChange,
  rightOfControls,
  itemizeValue,
  itemizedModalTitle,
  ...rest
}: SelectAndItemizeEditorProps) {
  const { itemsIsOpen, closeItems, openItems } = useToggleView("items", false);

  const isItemized = rest.selectValue === itemizeValue;
  return (
    <Styled className={`SelectAndItemizeEditorDepric ${className ?? ""}`}>
      <SelectEditorDepric
        {...{
          onChange: (e, ...args) => {
            unstable_batchedUpdates(() => {
              onChange && onChange(e, ...args);
              e.target.value === itemizeValue && openItems();
            });
          },
          ...rest,
          rightOfControls,
        }}
      />
      {rightOfControls
        ? null
        : isItemized && (
            <Box
              sx={{
                ml: nativeTheme.s3,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box sx={{ fontSize: "18px" }}>{`Total = ${total}`}</Box>
              <EditSectionBtn sx={{ ml: nativeTheme.s2 }} onClick={openItems} />
              <ModalSection
                title={itemizedModalTitle}
                closeModal={closeItems}
                show={itemsIsOpen}
              >
                {itemsComponent}
              </ModalSection>
            </Box>
          )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  .SelectAndItemizeEditor-itemizedTotalDiv {
    margin-left: ${theme.s3};
    display: flex;
    align-items: center;
  }
`;
