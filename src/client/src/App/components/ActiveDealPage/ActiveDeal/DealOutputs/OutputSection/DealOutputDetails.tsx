import { Box, SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { arrSx } from "../../../../../utils/mui";
import {
  DealDetailRowVarbFound,
  DealDetailRowVarbNotFoundTopLevel,
} from "./DealOutputDetails/DealDetailRow";

export function DealOutputDetails({
  feId,
  sx,
}: {
  feId: string;
  sx?: SxProps;
}) {
  const outputList = useGetterSection({
    sectionName: "outputList",
    feId,
  });
  const outputs = outputList.children("outputItem");
  const level = 0;
  return (
    <Box
      sx={[
        {
          border: `solid 1px ${nativeTheme.primary.main}`,
          borderRadius: nativeTheme.muiBr0,
          padding: `${nativeTheme.s1} 0`,
        },
        ...arrSx(sx),
      ]}
    >
      {outputs.map((output, idx) => {
        const mixedInfo = output.valueEntityInfo();
        const key = mixedInfo.entityId + `${idx}`;
        if (output.hasSectionByFocalMixed(mixedInfo)) {
          const { feVarbInfo } = output.varbByFocalMixed(mixedInfo);
          return (
            <DealDetailRowVarbFound {...{ varbInfo: feVarbInfo, level, key }} />
          );
        } else {
          return <DealDetailRowVarbNotFoundTopLevel key={key} />;
        }
      })}
    </Box>
  );
}
