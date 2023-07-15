import { Box, SxProps } from "@mui/material";
import { FeIdProp } from "../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { inEntityValueInfo } from "../../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useAction } from "../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useVariableLabels } from "../../../sharedWithServer/StateGetters/useVariableLabels";
import { AddChildOptions } from "../../../sharedWithServer/StateUpdaters/UpdaterSection";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import { MuiRow } from "../../general/MuiRow";
import { OnVarbSelect } from "../../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";
import { useDealModeContextVarbSelect } from "../../Modals/VarbSelectModalProvider";
import { HollowBtn } from "../HollowBtn";
import { LabelWithInfo } from "../LabelWithInfo";
import { VarbListMenuDual } from "../ListGroup/ListGroupShared/VarbListMenuDual";
import { RemoveSectionXBtn } from "../RemoveSectionXBtn";

export function LoadedVarbListNext({ feId, sx }: FeIdProp & { sx?: SxProps }) {
  const feInfo = { sectionName: "outputList", feId } as const;
  const outputList = useGetterSection(feInfo);
  const itemIds = outputList.childFeIds("outputItem");

  const addChild = useAction("addChild");
  const addItem: OnVarbSelect = (varbInfo) => {
    const options: AddChildOptions<"outputList", "outputItem"> = {
      sectionValues: { valueEntityInfo: inEntityValueInfo(varbInfo) },
    };
    addChild({
      feInfo,
      childName: "outputItem",
      options,
    });
  };

  const openVarbSelect = useDealModeContextVarbSelect(addItem);
  return (
    <Box sx={sx}>
      <Box
        sx={[
          {
            borderRadius: nativeTheme.muiBr0,
            ...nativeTheme.subSection.borderLines,
            borderBottom: "none",
            padding: nativeTheme.s2,
            paddingTop: nativeTheme.s3,
          },
        ]}
      >
        <MuiRow
          sx={{
            justifyContent: "center",
            fontSize: nativeTheme.fs20,
            color: nativeTheme.darkBlue.main,
            marginBottom: nativeTheme.s2,
          }}
        >
          Variables to compare by
        </MuiRow>
        <VarbListMenuDual
          {...{
            ...feInfo,
            menuType: "value",
          }}
        />
      </Box>
      {itemIds.map((itemId) => (
        <LoadedVarbItemNext {...{ feId: itemId, key: itemId }} />
      ))}
      <AddItemBtn
        {...{
          text: "+ Variable",
          onClick: openVarbSelect,
        }}
      />
    </Box>
  );
}

function LoadedVarbItemNext({ feId }: FeIdProp) {
  const feInfo = { sectionName: "outputItem", feId } as const;
  const outputItem = useGetterSection(feInfo);
  const varbInfo = outputItem.valueEntityInfo();
  const { variableLabel, infoDot } = useVariableLabels({
    focalInfo: feInfo,
    varbInfo,
  });
  return (
    <MuiRow
      className={"LoadedVarbItem-root"}
      sx={{
        minWidth: 200,
        minHeight: 45,
        justifyContent: "space-between",
        padding: nativeTheme.s3,
        paddingLeft: nativeTheme.s4,
        ...nativeTheme.subSection.borderLines,
        borderRadius: nativeTheme.muiBr0,
        borderBottom: "none",
        fontSize: nativeTheme.fs18,
        color: nativeTheme.primary.main,
      }}
    >
      <MuiRow>
        <LabelWithInfo
          {...{
            label: variableLabel,
            ...infoDot,
          }}
        />
      </MuiRow>
      <RemoveSectionXBtn {...feInfo} />
    </MuiRow>
  );
}

function AddItemBtn({
  text,
  onClick,
  sx,
}: {
  text: string;
  onClick: () => void;
  sx?: SxProps;
}) {
  return (
    <HollowBtn
      {...{
        middle: text,
        onClick: onClick,
        sx: [
          {
            ...nativeTheme.subSection.borderLines,
            borderRadius: nativeTheme.muiBr0,
            fontSize: nativeTheme.fs20,
            minHeight: 25,
            width: "100%",
            padding: nativeTheme.s3,
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
