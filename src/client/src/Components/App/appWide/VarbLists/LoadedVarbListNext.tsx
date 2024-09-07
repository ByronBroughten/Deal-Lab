import { Box, SxProps } from "@mui/material";
import { FeIdProp } from "../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { AddChildOptions } from "../../../../sharedWithServer/StateOperators/Updaters/UpdaterSection";
import { inEntityValueInfo } from "../../../../sharedWithServer/stateSchemas/StateValue/InEntityValue";
import { useAction } from "../../../../stateHooks/useAction";
import { useGetterSection } from "../../../../stateHooks/useGetterSection";
import { useVariableLabels } from "../../../../stateHooks/useVariableLabels";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { arrSx } from "../../../../utils/mui";
import { MuiRow } from "../../../general/MuiRow";
import { OnVarbSelect } from "../../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";
import { useDealModeContextVarbSelectModal } from "../../Modals/VarbSelectModalProvider";
import { HollowBtn } from "../HollowBtn";
import { VarbListMenuDual } from "../ListGroup/ListGroupShared/VarbListMenuDual";
import { RemoveSectionXBtn } from "../RemoveSectionXBtn";

interface Props extends FeIdProp {
  sx: SxProps;
  title?: string;
}

function ListItemsViewWindow({ feId }: FeIdProp) {
  const outputList = useGetterSection({ sectionName: "outputList", feId });
  const itemIds = outputList.childFeIds("outputItem");
  return itemIds.length === 0 ? null : (
    <Box sx={{ marginBottom: nativeTheme.s4 }}>
      {itemIds.map((itemId, idx) => (
        <LoadedVarbItem
          {...{
            feId: itemId,
            key: itemId,
            sx: {
              fontSize: 16,
              padding: nativeTheme.s3,
              paddingTop: nativeTheme.s2,
              paddingBottom: nativeTheme.s2,
              minHeight: "30px",
              ...(idx === 0 && {
                borderTopRightRadius: nativeTheme.muiBr0,
                borderTopLeftRadius: nativeTheme.muiBr0,
              }),
              ...(idx === itemIds.length - 1 && {
                borderBottomRightRadius: nativeTheme.muiBr0,
                borderBottomLeftRadius: nativeTheme.muiBr0,
                borderBottom: `1px solid ${nativeTheme["gray-400"]}`,
              }),
            },
          }}
        />
      ))}
    </Box>
  );
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

  const openVarbSelect = useDealModeContextVarbSelectModal(addItem, () => (
    <ListItemsViewWindow {...{ feId }} />
  ));

  return (
    <Box sx={sx}>
      <Box
        sx={[
          {
            borderRadius: nativeTheme.muiBr0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            ...nativeTheme.subSection.borderLines,
            borderBottomWidth: 0,
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

function LoadedVarbItem({ feId, sx }: { feId: string; sx?: SxProps }) {
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
      sx={[
        {
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
        },
        ...arrSx(sx),
      ]}
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
