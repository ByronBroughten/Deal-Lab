import { SxProps } from "@mui/material";
import React from "react";
import { FeVarbInfoNext } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { UnionValueName } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { validateStateValue } from "../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { MuiSelectStyled } from "./MuiSelectStyled";

interface MuiSelectProps<UVN extends UnionValueName, SN extends SectionName> {
  unionValueName: UVN;
  items: [StateValue<UVN>, string][];
  value: StateValue<UVN>;
  feVarbInfo: FeVarbInfoNext<SN>;
  label?: React.ReactNode;
  sx?: SxProps;
}
export function MuiSelect<UVN extends UnionValueName, SN extends SectionName>({
  unionValueName,
  feVarbInfo,
  ...rest
}: MuiSelectProps<UVN, SN>) {
  const updateValue = useAction("updateValue");
  return (
    <MuiSelectStyled
      {...{
        onChange: (e) => {
          updateValue({
            ...feVarbInfo,
            value: validateStateValue(e.target.value, unionValueName),
          });
        },
        ...rest,
      }}
    />
  );
}
