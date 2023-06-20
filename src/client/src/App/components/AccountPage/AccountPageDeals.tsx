import { Box } from "@mui/material";
import { View } from "react-native";
import { MoonLoader } from "react-spinners";
import { useUserDataStatus } from "../../modules/SectionActors/UserDataActor";
import { useActionWithProps } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { useQueryAction } from "../../sharedWithServer/stateClassHooks/useQueryAction";
import { StoreId } from "../../sharedWithServer/StateGetters/StoreId";
import { nativeTheme } from "../../theme/nativeTheme";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import ChunkTitle from "../general/ChunkTitle";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { AccountPageDeal } from "./AccountPageDeal";

function useFilteredDeals() {
  const main = useGetterSectionOnlyOne("main");
  const feStore = main.onlyChild("feStore");
  const dealMenu = main.onlyChild("mainDealMenu");
  const session = main.onlyChild("sessionVarbs");

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
export function AccountPageDeals() {
  const main = useGetterSectionOnlyOne("main");
  const session = main.onlyChild("sessionVarbs");
  const dealMenu = main.onlyChild("mainDealMenu");
  const showArchived = session.valueNext("showArchivedDeals");

  const deals = useFilteredSortedDeals();

  const queryAction = useQueryAction();
  const showArchivedDeals = () => queryAction({ type: "showArchivedDeals" });

  const hideArchivedDeals = useActionWithProps("updateValue", {
    ...session.varbInfo("showArchivedDeals"),
    value: false,
  });

  const dataStatus = useUserDataStatus();
  const loading = dataStatus === "loading";
  return (
    <MuiRow
      sx={{
        // ...nativeTheme.mainSection,
        flex: 1,
        height: "100%",
        margin: nativeTheme.dealMenuElement.margin,
        justifyContent: "center",
        paddingLeft: nativeTheme.s45,
        paddingRight: nativeTheme.s45,
        paddingBottom: nativeTheme.s5,
        paddingTop: nativeTheme.s4,
        // borderColor: nativeTheme.primary.main,
        // borderWidth: 1,
        // borderStyle: "solid",
        borderRadius: nativeTheme.br0,
        backgroundColor: nativeTheme.light,
        boxShadow: nativeTheme.oldShadow4,
      }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <ChunkTitle>Saved Deals</ChunkTitle>
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
                mt: nativeTheme.s3,
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <BigStringEditor
                {...{
                  placeholder: "Filter by title",
                  feVarbInfo: dealMenu.varbInfo("dealNameFilter"),
                }}
              />
              {showArchived && (
                <StyledActionBtn
                  {...{
                    sx: { marginLeft: nativeTheme.s2 },
                    onClick: hideArchivedDeals,
                    left: icons.unArchive({ size: 25 }),
                    middle: "Hide Archived",
                  }}
                />
              )}
              {!showArchived && (
                <StyledActionBtn
                  {...{
                    sx: { marginLeft: nativeTheme.s2 },
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
              {deals.map(({ feId }, idx) => (
                <IdOfSectionToSaveProvider
                  storeId={StoreId.make("dealMain", feId)}
                  key={feId}
                >
                  <AccountPageDeal
                    {...{
                      feId,
                      ...(idx === deals.length - 1 && {
                        style: { borderBottomWidth: 1 },
                      }),
                    }}
                  />
                </IdOfSectionToSaveProvider>
              ))}
            </Box>
          </>
        )}
      </View>
    </MuiRow>
  );
}
