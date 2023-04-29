import { SxProps } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { FeVarbInfoNext } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { UnionValueName } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { validateStateValue } from "../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterVarbNext } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { MuiSelectOnChange } from "../../utils/mui";
import { MuiSelectStyled } from "./MuiSelectStyled";

export interface MuiSelectProps<
  UVN extends UnionValueName,
  SN extends SectionName
> {
  unionValueName: UVN;
  items: [StateValue<UVN>, string][];
  feVarbInfo: FeVarbInfoNext<SN>;
  onChangeOverride?: MuiSelectOnChange;
  batchedWithChange?: MuiSelectOnChange;
  selectProps?: { sx?: SxProps };
  label?: React.ReactNode;
  sx?: SxProps;
}

export function MuiSelect<UVN extends UnionValueName, SN extends SectionName>({
  unionValueName,
  feVarbInfo,
  onChangeOverride,
  batchedWithChange,
  ...rest
}: MuiSelectProps<UVN, SN>) {
  const varb = useGetterVarbNext(feVarbInfo);
  const updateValue = useAction("updateValue");
  const onChangeDefault: MuiSelectOnChange = (e) => {
    updateValue({
      ...feVarbInfo,
      value: validateStateValue(e.target.value, unionValueName),
    });
  };

  const onChange = onChangeOverride ?? onChangeDefault;
  return (
    <MuiSelectStyled
      {...{
        value: varb.value(unionValueName),
        onChange: (e, ...args) => {
          unstable_batchedUpdates(() => {
            batchedWithChange && batchedWithChange(e, ...args);
            onChange(e, ...args);
          });
        },
        ...rest,
      }}
    />
  );
}
