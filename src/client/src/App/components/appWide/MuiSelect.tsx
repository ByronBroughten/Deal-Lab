import { SxProps } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { FeVarbInfoNext } from "../../../sharedWithServer/SectionInfos/FeInfo";
import { SectionName } from "../../../sharedWithServer/sectionVarbsConfig/SectionName";
import { StateValue } from "../../../sharedWithServer/sectionVarbsConfig/StateValue";
import { UnionValueName } from "../../../sharedWithServer/sectionVarbsConfig/StateValue/unionValues";
import { validateStateValue } from "../../../sharedWithServer/sectionVarbsConfig/valueMetas";
import { useAction } from "../../stateClassHooks/useAction";
import { useGetterVarbNext } from "../../stateClassHooks/useGetterVarb";
import { MuiSelectOnChange } from "../../utils/mui";
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
