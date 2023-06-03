import { Box, SxProps } from "@mui/material";
import { InEntityValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbPathArrParam } from "../../../../../sharedWithServer/StateEntityGetters/varbPathOptions";
import { LabeledVarbProps } from "../../../../appWide/LabeledVarb";
import { LabeledVarbRow } from "../../../../appWide/LabeledVarbRow";

function useLoadedOutputRowProps(feId: string): LabeledVarbProps[] {
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
  const outPutList = useSetterSection({
    sectionName: "outputList",
    feId,
  });

  const onSelectNext = (param: VarbPathArrParam) => {
    outPutList.addChild("outputItem", {
      sectionValues: {
        valueEntityInfo: {
          infoType: "varbPathName",
          varbPathName: param.varbPathName,
        } as InEntityValue,
      },
    });
  };

  const propArr = useLoadedOutputRowProps(feId);
  return (
    <Box sx={sx}>
      <LabeledVarbRow {...{ varbPropArr: propArr }} />
    </Box>
  );
}
