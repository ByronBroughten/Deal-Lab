import { Box } from "@mui/material";
import React from "react";
import { useGetterVarb } from "../../../modules/stateHooks/useGetterVarb";
import {
  FeVarbInfo,
  FeVarbInfoNext,
} from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { nativeTheme } from "../../../theme/nativeTheme";
import { TogglerBooleanVarb } from "./TogglerBooleanVarb";
import { VarbStringLabel } from "./VarbStringLabel";

type Props = {
  feVarbInfo: FeVarbInfo;
  toggledNode: React.ReactNode;
  editorMargins?: boolean;
};
export function ToggledNode({ feVarbInfo, toggledNode, editorMargins }: Props) {
  const varb = useGetterVarb(feVarbInfo);
  const value = varb.value("boolean");
  return (
    <Box
      sx={{
        width: 325,
        "& .MuiFormGroup-root": {
          marginBottom: nativeTheme.s2,
        },
      }}
    >
      <TogglerBooleanVarb
        {...{
          feVarbInfo,
          label: <VarbStringLabel names={feVarbInfo as FeVarbInfoNext} />,
          editorMargins,
        }}
      />
      {value && toggledNode}
    </Box>
  );
}
