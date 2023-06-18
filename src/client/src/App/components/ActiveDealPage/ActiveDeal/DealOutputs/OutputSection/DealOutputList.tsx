import { Box, SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { LabeledVarbFinder } from "../../../../appWide/LabeledVarbNext";
import { LabeledVarbRow } from "../../../../appWide/LabeledVarbRow";

function useLoadedOutputRowProps(feId: string): LabeledVarbFinder[] {
  const outputList = useGetterSection({
    sectionName: "outputList",
    feId,
  });

  return outputList.children("outputItem").map((outputItem) => {
    const entityVarbInfo = outputItem.valueEntityInfo();
    const { feVarbInfo } = outputItem.varbByFocalMixed(entityVarbInfo);
    return feVarbInfo;
  });
}

export function DealOutputList({ feId, sx }: { feId: string; sx?: SxProps }) {
  const propArr = useLoadedOutputRowProps(feId);
  return (
    <Box sx={sx}>
      <LabeledVarbRow {...{ varbPropArr: propArr }} />
    </Box>
  );
}
