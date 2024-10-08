import { Box, SxProps } from "@mui/material";
import { useGetterVarbNext } from "../../../modules/stateHooks/useGetterVarb";
import { FeVarbInfoNext } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { VarbName } from "../../../sharedWithServer/stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { SectionName } from "../../../sharedWithServer/stateSchemas/schema2SectionNames";
import ChunkTitle from "../../general/ChunkTitle";
import { MuiRow } from "../../general/MuiRow";
import { TogglerBooleanVarb } from "./TogglerBooleanVarb";

type Props<SN extends SectionName, VN extends VarbName<SN>> = {
  children: React.ReactNode;
  sx?: SxProps;
  labelText: string;
  labelProps?: { sx?: SxProps };
  feVarbInfo: FeVarbInfoNext<SN, VN>;
};

export function SectionToggler<
  SN extends SectionName,
  VN extends VarbName<SN>
>({ sx, labelProps, labelText, feVarbInfo, children }: Props<SN, VN>) {
  const varb = useGetterVarbNext(feVarbInfo);
  return (
    <Box sx={sx}>
      <MuiRow>
        <TogglerBooleanVarb
          {...{
            feVarbInfo,
            label: <ChunkTitle {...labelProps}>{labelText}</ChunkTitle>,
          }}
        />
      </MuiRow>
      {varb.value("boolean") && children}
    </Box>
  );
}
