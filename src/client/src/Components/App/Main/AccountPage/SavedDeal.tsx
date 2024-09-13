import { SxProps } from "@mui/material";
import { Box } from "@mui/system";
import { PulseLoader } from "react-spinners";
import {
  useAction,
  useActionNoSave,
  useActionWithProps,
} from "../../../../modules/stateHooks/useAction";
import {
  useGetterSection,
  useGetterSectionOnlyOne,
} from "../../../../modules/stateHooks/useGetterSection";
import { arrSx } from "../../../../modules/utils/mui";
import { constants } from "../../../../sharedWithServer/Constants";
import {
  DbIdProp,
  FeIdProp,
} from "../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { dealModeLabels } from "../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/unionValues";
import { timeS } from "../../../../sharedWithServer/utils/timeS";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { MuiRow } from "../../../general/MuiRow";
import { Row } from "../../../general/Row";
import { TextNext } from "../../../general/TextNext";
import { StyledActionBtn } from "../../appWide/GeneralSection/MainSection/StyledActionBtn";
import { LabelText, StyledLabeledVarb } from "../../appWide/LabeledVarbNext";
import { showToastInfo } from "../../appWide/toast";
import { useIsDevices } from "../../customHooks/useMediaQueries";
import { icons } from "../../Icons";
import { BareStringEditor } from "../../inputs/BareStringEditor";
import { useConfirmationModal } from "../../Modals/ConfirmationModalProvider";

const titleSx = (displayName: string, minWidth: number | string) => ({
  color: nativeTheme.primary.main,
  fontSize: nativeTheme.fs18,
  maxWidth: minWidth,
  ...(!displayName && { fontStyle: "italic" }),
  "& .DraftEditor-root": {
    color: nativeTheme.primary.main,
    fontSize: nativeTheme.fs18,
    maxWidth: minWidth,
    ...(!displayName && { fontStyle: "italic" }),
  },
});

const dealTypeProps = {
  sx: {
    fontSize: nativeTheme.fs16,
    marginLeft: nativeTheme.s2,
  },
} as const;

const iconProps = {
  style: {
    color: nativeTheme.primary.main,
  },
  size: 25,
} as const;

const rowStyle = {
  margin: nativeTheme.s1,
  marginRight: nativeTheme.s25,
} as const;

type SavedDealProps = {
  dbId: string;
  sx?: SxProps;
  isInactive?: boolean;
};

export function SavedDeal(props: SavedDealProps) {
  const { isPhone } = useIsDevices();
  if (isPhone) {
    return <PhoneVersion {...props} />;
  } else {
    return <TabAndDeskVersion {...props} />;
  }
}

function PhoneVersion({ dbId, isInactive, sx }: SavedDealProps) {
  const feStore = useGetterSectionOnlyOne("feStore");
  const deal = feStore.childByDbId({
    childName: "dealMain",
    dbId,
  });

  const session = useGetterSectionOnlyOne("sessionStore");
  const sessionDeal = session.childByDbId({
    childName: "dealMain",
    dbId: deal.dbId,
  });

  const { feId } = deal;
  const dealMode = deal.valueNext("dealMode");

  const strDisplayName = deal.stringValue("displayName");
  const isComplete = deal.valueNext("completionStatus") === "allValid";

  return (
    <Box
      sx={[
        {
          flex: 1,
          padding: nativeTheme.s2,
          // paddingLeft: nativeTheme.s15,
          // paddingRight: nativeTheme.s15,
          border: "none",
          ...nativeTheme.formSection,
          ...(isInactive && { backgroundColor: nativeTheme["gray-150"] }),
        },
        ...arrSx(sx),
      ]}
    >
      <MuiRow>
        <MuiRow
          sx={{
            ...titleSx(strDisplayName, "auto"),
            flexWrap: "nowrap",
          }}
        >
          {/* {strDisplayName || "Untitled"} */}
          {icons[dealMode](iconProps)}
          <BareStringEditor
            {...{
              sx: {
                marginLeft: nativeTheme.s2,
                ...titleSx(strDisplayName, "auto"),
              },
              feVarbInfo: deal.varbInfo2("displayNameEditor"),
              placeholder: "Untitled",
              noSolve: true,
            }}
          />
        </MuiRow>
      </MuiRow>
      <MuiRow>
        <DealActions {...{ dbId, feId, isInactive }} />
      </MuiRow>
    </Box>
  );
}

function TabAndDeskVersion({ dbId, isInactive, sx }: SavedDealProps) {
  const feStore = useGetterSectionOnlyOne("feStore");
  const deal = feStore.childByDbId({
    childName: "dealMain",
    dbId,
  });
  const { feId } = deal;

  const { isDesktop } = useIsDevices();
  const dealMode = deal.valueNext("dealMode");
  const strDisplayName = deal.stringValue("displayName");
  const isComplete = deal.valueNext("completionStatus") === "allValid";

  const dateNumber = deal.valueNext("dateTimeFirstSaved");
  const dateCreated = timeS.timestampToLegible(dateNumber);

  const session = useGetterSectionOnlyOne("sessionStore");
  const sessionDeal = session.childByDbId({
    childName: "dealMain",
    dbId,
  });
  const sessionVarb = sessionDeal.onlyChild("sessionVarb");
  return (
    <Box
      sx={[
        {
          flex: 1,
          padding: nativeTheme.s3,
          paddingLeft: nativeTheme.s4,
          paddingRight: nativeTheme.s4,
          ...nativeTheme.formSection,
          ...(isInactive && { backgroundColor: nativeTheme["gray-150"] }),
        },
        ...arrSx(sx),
      ]}
    >
      <Row sx={{ justifyContent: "space-between" }}>
        <Box sx={titleSx(strDisplayName, 400)}>
          {strDisplayName || "Untitled"}
          {/* <BareStringEditor
            {...{
              sx: titleSx(strDisplayName, 400),
              feVarbInfo: deal.varbInfo2("displayNameEditor"),
              placeholder: "Untitled",
              noSolve: true,
            }}
          /> */}
        </Box>
        {
          <Row
            sx={{
              ...rowStyle,
              paddingLeft: nativeTheme.s4,
            }}
          >
            <TextNext>Created </TextNext>
            <TextNext>{dateCreated}</TextNext>
          </Row>
        }
      </Row>
      <Row sx={{ justifyContent: "space-between" }}>
        <Row sx={rowStyle}>
          {icons[dealMode](iconProps)}
          {isDesktop && (
            <TextNext {...dealTypeProps}>{dealModeLabels[dealMode]}</TextNext>
          )}

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
          </MuiRow>
        )}
        {<DealActions {...{ feId, dbId, isInactive }} />}
      </Row>
    </Box>
  );
}

function DealActions({
  dbId,
  feId,
  isInactive,
}: FeIdProp & DbIdProp & { isInactive?: boolean }) {
  const deal = useGetterSection({ sectionName: "deal", feId });

  const session = useGetterSectionOnlyOne("sessionStore");
  const dbIdToEdit = session.valueNext("dealDbIdToEdit");
  const loadingEdit = deal.dbId === dbIdToEdit;

  const copyDeal = useActionWithProps("copyInStore", {
    storeName: "dealMain",
    feId,
  });

  const updateValueNoSave = useActionNoSave("updateValue");
  const setCreateDeal = () =>
    updateValueNoSave({
      ...session.varbInfo("dealDbIdToEdit"),
      value: deal.dbId,
    });

  const isArchived = deal.valueNext("isArchived");
  const deleteDeal = useActionWithProps("removeStoredDeal", { dbId });
  const { setModal } = useConfirmationModal();
  const warnAndDelete = () =>
    setModal({
      title: "Are you sure you want to delete this home?",
      description: "It will be deleted permanently.",
      handleSubmit: deleteDeal,
    });

  const archiveDeal = useActionWithProps("archiveDeal", { feId });

  const updateValue = useAction("updateValue");
  const unArchiveDeal = () =>
    updateValue({
      ...deal.varbInfo("isArchived"),
      value: false,
    });

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
    <MuiRow>
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
                margin: nativeTheme.s1,
                marginTop: nativeTheme.s25,
                minWidth: "64px",
              },
              left: icons.edit({ size: 20 }),
              onClick: setCreateDeal,
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
              minWidth: "64px",
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
      </MuiRow>
      <MuiRow>
        <StyledActionBtn
          {...{
            sx: {
              margin: nativeTheme.s1,
              marginTop: nativeTheme.s25,
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
    </MuiRow>
  );
}
