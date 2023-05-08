import { Box } from "@mui/system";
import { unstable_batchedUpdates } from "react-dom";
import { Text, View, ViewStyle } from "react-native";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useActionWithProps } from "../../sharedWithServer/stateClassHooks/useAction";
import { nativeTheme } from "../../theme/nativeTheme";
import { reactNativeS } from "../../utils/reactNative";
import { useGoToPage } from "../appWide/customHooks/useGoToPage";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { useConfirmation } from "../general/ConfirmationDialogueProvider";
import { useGetterSection } from "./../../sharedWithServer/stateClassHooks/useGetterSection";
import { Row } from "./../general/Row";
import { icons } from "./../Icons";

const titleProps = (displayName: string) => ({
  sx: {
    color: nativeTheme.primary.main,
    fontSize: nativeTheme.fs18,
    maxWidth: 800,
    ...(!displayName && { fontStyle: "italic" }),
  },
});

const dealTypeProps = {
  style: {
    fontSize: nativeTheme.fs16,
    marginLeft: nativeTheme.s2,
  },
};

const iconProps = {
  style: {
    color: nativeTheme.primary.main,
  },
  size: 20,
};

const rowStyle = reactNativeS.view({
  margin: nativeTheme.s1,
  marginRight: nativeTheme.s25,
  alignItems: "center",
});

export function AccountPageDeal({
  feId,
  style,
}: {
  feId: string;
  style?: ViewStyle;
}) {
  const storeName = "dealMain";
  const deal = useGetterSection({ sectionName: "deal", feId });
  const goToActiveDeal = useGoToPage("activeDeal");
  const copyDeal = useActionWithProps("copyInStore", { storeName, feId });
  const activateDeal = useActionWithProps("activateDeal", { feId });

  const deleteDeal = useActionWithProps("removeStoredDeal", { feId });
  const confirm = useConfirmation();

  const warnAndDelete = async () =>
    confirm({
      title: "Are you sure you want to delete this deal?",
      description: "It will be deleted permanently.",
      variant: "danger",
    })
      .then(deleteDeal)
      .catch();

  const dateNumber = deal.valueNext("dateTimeFirstSaved");
  const dateCreated = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  }).format(dateNumber);

  const dealMode = deal.valueNext("dealMode");
  const editDeal = () => {
    unstable_batchedUpdates(() => {
      activateDeal();
      goToActiveDeal();
    });
  };

  const strDisplayName = deal.stringValue("displayName");
  return (
    <View
      style={{
        ...style,
        flex: 1,
        padding: nativeTheme.s3,
        paddingLeft: nativeTheme.s4,
        paddingRight: nativeTheme.s4,
        ...nativeTheme.formSection,
      }}
    >
      <Row style={{ justifyContent: "space-between" }}>
        <Box {...titleProps(strDisplayName)}>
          {strDisplayName || "Untitled"}
        </Box>
        <Row
          style={{
            ...rowStyle,
            paddingLeft: nativeTheme.s4,
          }}
        >
          <Text>Created </Text>
          <Text>{dateCreated}</Text>
        </Row>
      </Row>
      <Row style={{ justifyContent: "space-between" }}>
        <Row style={rowStyle}>
          {icons[dealMode](iconProps)}
          <Text {...dealTypeProps}>{dealModeLabels[dealMode]}</Text>
          {!deal.valueNext("isComplete") && (
            <Box
              sx={{
                color: nativeTheme.notice.dark,
                ml: nativeTheme.s3,
                fontStyle: "italic",
              }}
            >
              {"Incomplete"}
            </Box>
          )}
        </Row>
        <Row>
          <StyledActionBtn
            {...{
              sx: {
                margin: nativeTheme.s15,
                marginTop: nativeTheme.s25,
                marginRight: nativeTheme.s2,
              },
              left: icons.edit({ size: 20 }),
              middle: "Edit",
              onClick: editDeal,
            }}
          />
          <StyledActionBtn
            {...{
              onClick: copyDeal,
              sx: {
                margin: nativeTheme.s1,
                marginTop: nativeTheme.s25,
                marginRight: nativeTheme.s15,
              },
              left: icons.copy({ size: 20 }),
              middle: "Copy",
            }}
          />
          <StyledActionBtn
            {...{
              isDangerous: true,
              onClick: warnAndDelete,
              sx: {
                margin: nativeTheme.s1,
                marginTop: nativeTheme.s25,
              },
              left: icons.delete({ size: 20 }),
              middle: "Delete",
            }}
          />
        </Row>
      </Row>
    </View>
  );
}
