import { Box } from "@mui/system";
import { Text, View, ViewStyle } from "react-native";
import { PulseLoader } from "react-spinners";
import { constants } from "../../Constants";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import {
  useAction,
  useActionNoSave,
  useActionWithProps,
} from "../../sharedWithServer/stateClassHooks/useAction";
import {
  useGetterSection,
  useGetterSectionOnlyOne,
} from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { reactNativeS } from "../../utils/reactNative";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { LabelText, StyledLabeledVarb } from "../appWide/LabeledVarbNext";
import { showToastInfo } from "../appWide/toast";
import { MuiRow } from "../general/MuiRow";
import { Row } from "../general/Row";
import { icons } from "../Icons";
import { BareStringEditor } from "../inputs/BareStringEditor";
import { useConfirmationModal } from "../Modals/ConfirmationModalProvider";

const titleProps = (displayName: string) => ({
  sx: {
    color: nativeTheme.primary.main,
    fontSize: nativeTheme.fs18,
    maxWidth: 800,
    ...(!displayName && { fontStyle: "italic" }),
    "& .DraftEditor-root": {
      color: nativeTheme.primary.main,
      fontSize: nativeTheme.fs18,
      maxWidth: 800,
      ...(!displayName && { fontStyle: "italic" }),
    },
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
  size: 25,
};

const rowStyle = reactNativeS.view({
  margin: nativeTheme.s1,
  marginRight: nativeTheme.s25,
  alignItems: "center",
});

export function SavedDeal({
  feId,
  style,
  isInactive,
}: {
  feId: string;
  style?: ViewStyle;
  isInactive?: boolean;
}) {
  const storeName = "dealMain";
  const deal = useGetterSection({ sectionName: "deal", feId });
  const session = useGetterSectionOnlyOne("sessionStore");
  const dbIdToEdit = session.valueNext("dealDbIdToEdit");
  const loadingEdit = deal.dbId === dbIdToEdit;

  const updateValueNoSave = useActionNoSave("updateValue");
  const setCreatingDeal = () =>
    updateValueNoSave({
      ...session.varbInfo("dealDbIdToEdit"),
      value: deal.dbId,
    });

  const sessionDeal = session.childByDbId({
    childName: "dealMain",
    dbId: deal.dbId,
  });
  const sessionVarb = sessionDeal.onlyChild("sessionVarb");

  const copyDeal = useActionWithProps("copyInStore", { storeName, feId });
  const archiveDeal = useActionWithProps("archiveDeal", { feId });

  const updateValue = useAction("updateValue");
  const unArchiveDeal = () =>
    updateValue({
      ...deal.varbInfo("isArchived"),
      value: false,
    });

  const isArchived = deal.valueNext("isArchived");

  const deleteDeal = useActionWithProps("removeStoredDeal", { feId });
  const { setModal } = useConfirmationModal();

  const warnAndDelete = () =>
    setModal({
      title: "Are you sure you want to delete this deal?",
      description: "It will be deleted permanently.",
      handleSubmit: deleteDeal,
    });

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

  const strDisplayName = deal.stringValue("displayName");
  const isComplete = deal.valueNext("completionStatus") === "allValid";

  const archiveBtnProps = isArchived
    ? {
        left: icons.unArchive({ size: 20 }),
        middle: "Un-Archive",
        onClick: unArchiveDeal,
      }
    : {
        left: icons.doArchive({ size: 20 }),
        middle: "Archive",
        onClick: archiveDeal,
      };

  return (
    <View
      style={{
        ...style,
        flex: 1,
        padding: nativeTheme.s3,
        paddingLeft: nativeTheme.s4,
        paddingRight: nativeTheme.s4,
        ...nativeTheme.formSection,
        ...(isInactive && { backgroundColor: nativeTheme["gray-150"] }),
      }}
    >
      <Row style={{ justifyContent: "space-between" }}>
        <Box {...titleProps(strDisplayName)}>
          {/* {strDisplayName || "Untitled"} */}
          <BareStringEditor
            {...{
              ...titleProps(strDisplayName),
              feVarbInfo: deal.varbInfoNext("displayNameEditor"),
              placeholder: "Untitled",
              noSolve: true,
            }}
          />
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
          {!isComplete && (
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
        {isComplete && (
          <MuiRow
            sx={{
              justifyContent: "flex-end",
              flex: 1,
              paddingRight: nativeTheme.s35,
              paddingLeft: nativeTheme.s35,
            }}
          >
            <StyledLabeledVarb
              {...{
                labelId: sessionVarb.valueNext("label"),
                labelText: (
                  <LabelText
                    {...{
                      label: sessionVarb.valueNext("label"),
                      sectionName: "deal",
                      varbName: sessionVarb.valueNext("varbName"),
                    }}
                  />
                ),
                displayVarb: sessionVarb.valueNext("value"),
                sx: { fontSize: 17 },
              }}
            />
            {/* <LabeledVarbNext
              {...{
                finder: deal.varbInfo(outputPerDeal[dealMode]),
                sx: { fontSize: 17 },
              }}
            /> */}
          </MuiRow>
        )}
        <MuiRow>
          {loadingEdit && (
            <PulseLoader
              {...{
                loading: true,
                color: nativeTheme.darkBlue.main,
                size: 15, //22
                style: { width: "64px" },
              }}
            />
          )}
          {!loadingEdit && (
            <StyledActionBtn
              {...{
                sx: {
                  margin: nativeTheme.s15,
                  marginTop: nativeTheme.s25,
                  marginRight: nativeTheme.s2,
                  width: "64px",
                },
                left: icons.edit({ size: 20 }),
                onClick: setCreatingDeal,
                middle: "Edit",
                ...(isInactive && {
                  showAsDisabled: true,
                  onClick: () =>
                    showToastInfo(
                      `To edit any deals other than your ${constants.basicStorageLimit} newest ones, upgrade to pro.`
                    ),
                }),
              }}
            />
          )}
          <StyledActionBtn
            {...{
              sx: {
                margin: nativeTheme.s1,
                marginTop: nativeTheme.s25,
                marginRight: nativeTheme.s15,
              },
              ...(isInactive && { showAsDisabled: true }),
              left: icons.copy({ size: 20 }),
              middle: "Copy",
              onClick: copyDeal,
              ...(isInactive && {
                showAsDisabled: true,
                onClick: () =>
                  showToastInfo(
                    `To copy any deals other than your ${constants.basicStorageLimit} newest ones, upgrade to pro.`
                  ),
              }),
            }}
          />
          <StyledActionBtn
            {...{
              sx: {
                margin: nativeTheme.s15,
                marginTop: nativeTheme.s25,
                marginRight: nativeTheme.s2,
              },
              ...archiveBtnProps,
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
        </MuiRow>
      </Row>
    </View>
  );
}
