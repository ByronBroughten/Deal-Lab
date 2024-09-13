import { Box } from "@mui/material";
import React from "react";
import { useGetterVarbNext } from "../../../modules/stateHooks/useGetterVarb";
import { arrSx } from "../../../modules/utils/mui";
import { SectionName } from "../../../sharedWithServer/stateSchemas/schema2SectionNames";
import { StateValue } from "../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue";
import { UnionValueName } from "../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/unionValues";
import { nativeTheme } from "../../../theme/nativeTheme";
import { MuiRow } from "../../general/MuiRow";
import { useIsDevices } from "../customHooks/useMediaQueries";
import { useInputModalWithContext } from "../Modals/InputModalProvider";
import { EditSectionBtn } from "./EditSectionBtn";
import { SelectEditor, SelectEditorPropsNext } from "./SelectEditor";

export interface SelectAndItemizeEditorProps<
  UVN extends UnionValueName,
  SN extends SectionName
> extends SelectEditorPropsNext<UVN, SN> {
  total: string;
  itemizeValue: StateValue<UVN>;
  itemsComponent: React.ReactNode;
  itemizedModalTitle: React.ReactNode;
  inputMargins?: boolean;
}

export function SelectAndItemizeEditor<
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
  inputMargins = false,
  ...rest
}: SelectAndItemizeEditorProps<UVN, SN>) {
  const { isPhone } = useIsDevices();

  const varb = useGetterVarbNext(rest.feVarbInfo);
  const value = varb.value(rest.unionValueName);
  const isItemized = value === itemizeValue;

  const { setModal } = useInputModalWithContext();
  const openItems = () =>
    setModal({
      showFinish: true,
      title: itemizedModalTitle,
      children: itemsComponent,
    });

  return (
    <MuiRow
      className="SelectAndItemizeEditor-root"
      sx={[
        {
          flexWrap: "nowrap",
          ...(inputMargins && nativeTheme.editorMargins),
        },
        ...arrSx(sx),
      ]}
    >
      <SelectEditor
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
            <MuiRow
              sx={{
                ...(rest.label && { height: 55 }),
                ...(!rest.label && { height: 30 }),
                ...nativeTheme.subSection.borderLines,
                borderLeftWidth: 0,
                borderBottomColor: nativeTheme["gray-600"],
                borderTopRightRadius: nativeTheme.muiBr0,
                pl: nativeTheme.s3,
                ...(isPhone && {
                  flexDirection: "column",
                  alignItems: "flex-start",
                }),
              }}
            >
              <EditSectionBtn sx={{ paddingBottom: -1 }} onClick={openItems} />
              <Box
                sx={{
                  fontSize: "18px",
                  ml: nativeTheme.s2,
                  mr: nativeTheme.s25,
                  whiteSpace: "nowrap",
                }}
              >{`Total = ${total}`}</Box>
            </MuiRow>
          )}
    </MuiRow>
  );
}
