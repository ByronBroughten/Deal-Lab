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
import { VarbListMenuDual } from "../ListGroup/ListGroupShared/VarbListMenuDual";
import { RemoveSectionXBtn } from "../RemoveSectionXBtn";

interface Props extends FeIdProp {
  sx: SxProps;
  title?: string;
}
export function LoadedVarbListNext({ feId, sx, title }: Props) {
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
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            ...nativeTheme.subSection.borderLines,
            borderBottom: "none",
            padding: nativeTheme.s2,
            paddingTop: nativeTheme.s3,
          },
        ]}
      >
        {title && (
          <MuiRow
            sx={{
              justifyContent: "center",
              fontSize: nativeTheme.fs20,
              color: nativeTheme.darkBlue.main,
              marginBottom: nativeTheme.s2,
            }}
          >
            {title}
          </MuiRow>
        )}
        <VarbListMenuDual
          {...{
            ...feInfo,
            menuType: "value",
          }}
        />
      </Box>
      {itemIds.map((itemId) => (
        <LoadedVarbItem {...{ feId: itemId, key: itemId }} />
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

function LoadedVarbItem({ feId }: FeIdProp) {
  const feInfo = { sectionName: "outputItem", feId } as const;
  const outputItem = useGetterSection(feInfo);
  const varbInfo = outputItem.valueEntityInfo();
  const { variableLabel, infoProps } = useVariableLabels({
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
        borderBottom: "none",
        fontSize: nativeTheme.fs18,
        color: nativeTheme.primary.main,
        zIndex: -1,
      }}
    >
      <MuiRow>
        {variableLabel}
        {/* <LabelWithInfo
          {...{
            label: variableLabel,
            infoProps,
          }}
        /> */}
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
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
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
