import { Box } from "@mui/material";
import React from "react";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { UnionValueName } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterVarbNext } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { MuiRow } from "../general/MuiRow";
import { EditSectionBtn } from "./EditSectionBtn";
import { ModalSection } from "./ModalSection";
import { SelectEditorNext, SelectEditorPropsNext } from "./SelectEditorNext";

export interface SelectAndItemizeEditorProps<
  UVN extends UnionValueName,
  SN extends SectionName
> extends SelectEditorPropsNext<UVN, SN> {
  total: string;
  itemizeValue: StateValue<UVN>;
  itemsComponent: React.ReactNode;
  itemizedModalTitle: React.ReactNode;
}

export function SelectAndItemizeEditorNext<
  UVN extends UnionValueName,
  SN extends SectionName
>({
  sx,
  total,
  itemsComponent,
  rightOfControls,
  itemizeValue,
  itemizedModalTitle,
  batchedWithChange,
  ...rest
}: SelectAndItemizeEditorProps<UVN, SN>) {
  const { itemsIsOpen, closeItems, openItems } = useToggleView("items", false);

  const varb = useGetterVarbNext(rest.feVarbInfo);
  const value = varb.value(rest.unionValueName);
  const isItemized = value === itemizeValue;
  return (
    <MuiRow
      className="SelectAndItemizeEditor-root"
      sx={[{ flexWrap: "nowrap" }, ...arrSx(sx)]}
    >
      <SelectEditorNext
        {...{
          className: "SelectAndItemizeEditor-selectEditor",
          batchedWithChange: (e, ...args) => {
            batchedWithChange && batchedWithChange(e, ...args);
            e.target.value === itemizeValue && openItems();
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
                ...(rest.label && { height: 55 }),
                ...(!rest.label && { height: 30 }),
                ...nativeTheme.subSection.borderLines,
                borderLeftWidth: 0,
                borderBottomColor: nativeTheme["gray-600"],
                borderTopRightRadius: nativeTheme.muiBr0,
                pl: nativeTheme.s3,
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
    </MuiRow>
  );
}
