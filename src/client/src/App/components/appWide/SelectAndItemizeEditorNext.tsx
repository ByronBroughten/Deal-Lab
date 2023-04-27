import { Box } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { UnionValueName } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterVarbNext } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { nativeTheme } from "../../theme/nativeTheme";
import { EditSectionBtn } from "./EditSectionBtn";
import { ModalSection } from "./ModalSection";
import { SelectEditorNext, SelectEditorPropsNext } from "./SelectEditorNext";

export interface SelectAndItemizeEditorProps<
  UVN extends UnionValueName,
  SN extends SectionName
> extends SelectEditorPropsNext<UVN, SN> {
  total: string;
  itemizeValue: string;
  itemsComponent: React.ReactNode;
  itemizedModalTitle: React.ReactNode;
}

export function SelectAndItemizeEditorNext<
  UVN extends UnionValueName,
  SN extends SectionName
>({
  total,
  itemsComponent,
  rightOfControls,
  itemizeValue,
  itemizedModalTitle,
  onChange,
  ...rest
}: SelectAndItemizeEditorProps<UVN, SN>) {
  const { itemsIsOpen, closeItems, openItems } = useToggleView("items", false);

  const varb = useGetterVarbNext(rest.feVarbInfo);
  const value = varb.value(rest.unionValueName);
  const isItemized = value === itemizeValue;
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <SelectEditorNext
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
    </Box>
  );
}
