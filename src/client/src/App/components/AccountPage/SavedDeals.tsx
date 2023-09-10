import { Box } from "@mui/material";
import { View } from "react-native";
import { MoonLoader } from "react-spinners";
import { constants } from "../../Constants";
import { useActionWithProps } from "../../sharedWithServer/stateClassHooks/useAction";
import {
  useGetterFeStore,
  useUserDataStatus,
} from "../../sharedWithServer/stateClassHooks/useFeStore";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { useQueryAction } from "../../sharedWithServer/stateClassHooks/useQueryAction";
import { StoreId } from "../../sharedWithServer/StateGetters/StoreId";
import { nativeTheme } from "../../theme/nativeTheme";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { useIsDevices } from "../customHooks/useMediaQueries";
import ChunkTitle from "../general/ChunkTitle";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { SavedDeal } from "./SavedDeal";

function useFilteredDeals() {
  const main = useGetterSectionOnlyOne("main");
  const feStore = main.onlyChild("feStore");
  const dealMenu = main.onlyChild("mainDealMenu");
  const session = main.onlyChild("sessionStore");

  const showArchived = session.valueNext("showArchivedDeals");
  const dealNameFilter = dealMenu.valueNext("dealNameFilter");
  const deals = feStore.children("dealMain");
  return deals.filter((deal) => {
    if (!showArchived && deal.valueNext("isArchived")) {
      return false;
    } else {
      return deal.stringValue("displayName").includes(dealNameFilter);
    }
  });
}

function useFilteredSortedDeals() {
  const deals = useFilteredDeals();
  return deals.sort(
    (a, b) =>
      b.valueNext("dateTimeLastSaved") - a.valueNext("dateTimeLastSaved")
  );
}

export const accountPageElementMargin = nativeTheme.s3;
export function SavedDeals() {
  const { labSubscription } = useGetterFeStore();
  const main = useGetterSectionOnlyOne("main");
  const session = main.onlyChild("sessionStore");
  const dealMenu = main.onlyChild("mainDealMenu");
  const showArchived = session.valueNext("showArchivedDeals");

  const deals = useFilteredSortedDeals();

  const queryAction = useQueryAction();
  const showArchivedDeals = () => queryAction({ type: "showArchivedDeals" });

  const hideArchivedDeals = useActionWithProps("updateValue", {
    ...session.varbInfo("showArchivedDeals"),
    value: false,
  });

  const sessionDeals = session.children("dealMain");
  sessionDeals.sort(
    (a, b) => b.valueNext("dateTimeCreated") - a.valueNext("dateTimeCreated")
  );

  const nMostRecent = sessionDeals.slice(0, constants.basicStorageLimit);
  const nRecentDbIds = nMostRecent.map(({ dbId }) => dbId);

  const dataStatus = useUserDataStatus();
  const loading = dataStatus === "loading";

  const { isPhone } = useIsDevices();

  return (
    <MuiRow
      sx={{
        // ...nativeTheme.mainSection,
        flex: 1,
        height: "100%",
        margin: nativeTheme.dealMenuElement.margin,
        justifyContent: "center",
        ...(isPhone
          ? {
              paddingLeft: nativeTheme.s2,
              paddingRight: nativeTheme.s2,
              paddingBottom: nativeTheme.s25,
              paddingTop: nativeTheme.s15,
            }
          : {
              paddingLeft: nativeTheme.s45,
              paddingRight: nativeTheme.s45,
              paddingBottom: nativeTheme.s5,
              paddingTop: nativeTheme.s4,
            }),
        borderRadius: nativeTheme.br0,
        backgroundColor: nativeTheme.light,
        boxShadow: nativeTheme.oldShadow4,
      }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <ChunkTitle>{`Saved ${constants.appUnitPlural}`}</ChunkTitle>
        {loading && (
          <MoonLoader
            {...{
              loading,
              color: nativeTheme.primary.main,
              size: 100,
              speedMultiplier: 0.8,
              cssOverride: { marginTop: nativeTheme.s3 },
            }}
          />
        )}
        {!loading && (
          <>
            <MuiRow
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                ...(isPhone && { marginLeft: nativeTheme.s15 }),
              }}
            >
              <BigStringEditor
                {...{
                  placeholder: "Filter by title",
                  feVarbInfo: dealMenu.varbInfo("dealNameFilter"),
                  sx: {
                    mt: nativeTheme.s3,
                    marginRight: nativeTheme.s2,
                    ...(isPhone && {
                      "& .DraftEditor-root": {
                        minWidth: 150,
                      },
                    }),
                  },
                }}
              />
              {showArchived && (
                <StyledActionBtn
                  {...{
                    sx: { mt: nativeTheme.s3 },
                    onClick: hideArchivedDeals,
                    left: icons.unArchive({ size: 25 }),
                    middle: "Hide Archived",
                  }}
                />
              )}
              {!showArchived && (
                <StyledActionBtn
                  {...{
                    sx: { mt: nativeTheme.s3 },
                    onClick: showArchivedDeals,
                    left: icons.doArchive({ size: 25 }),
                    middle: "Show Archived",
                  }}
                />
              )}
            </MuiRow>
            <Box
              sx={{
                mt: nativeTheme.s35,
                width: "100%",
              }}
            >
              {deals.map(({ feId, dbId }, idx) => {
                if (
                  session.hasChildByDbInfo({
                    childName: "dealMain",
                    dbId,
                  })
                ) {
                  return (
                    <IdOfSectionToSaveProvider
                      storeId={StoreId.make("dealMain", feId)}
                      key={feId}
                    >
                      <SavedDeal
                        {...{
                          ...(labSubscription === "basicPlan" &&
                            !nRecentDbIds.includes(dbId) && {
                              isInactive: true,
                            }),
                          dbId,
                          ...(idx === deals.length - 1 && {
                            style: { borderBottomWidth: 1 },
                          }),
                        }}
                      />
                    </IdOfSectionToSaveProvider>
                  );
                } else {
                  return null;
                }
              })}
            </Box>
          </>
        )}
      </View>
    </MuiRow>
  );
}
