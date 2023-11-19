import { Box } from "@mui/material";
import React from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterVarb } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { nativeTheme } from "../../theme/nativeTheme";
import { FeVarbInfoNext } from "./../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
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
