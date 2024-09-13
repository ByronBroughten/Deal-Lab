import { SxProps } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useAction } from "../../../modules/stateHooks/useAction";
import { useGetterVarbNext } from "../../../modules/stateHooks/useGetterVarb";
import { MuiSelectOnChange } from "../../../modules/utils/mui";
import { FeVarbInfoNext } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionName } from "../../../sharedWithServer/stateSchemas/schema2SectionNames";
import { validateStateValue } from "../../../sharedWithServer/stateSchemas/schema4ValueTraits";
import { StateValue } from "../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue";
import { UnionValueName } from "../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/unionValues";
import { MuiSelectStyled } from "./MuiSelectStyled";

export type MuiSelectItems<UVN extends UnionValueName> = (
  | [StateValue<UVN>, string]
  | null
)[];

export interface MuiSelectProps<
  UVN extends UnionValueName,
  SN extends SectionName
> {
  unionValueName: UVN;
  items: MuiSelectItems<UVN>;
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
      solve: true,
    });
  };

  const onChange = onChangeOverride ?? onChangeDefault;
  return (
    <MuiSelectStyled
      {...{
        id: varb.varbId,
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
