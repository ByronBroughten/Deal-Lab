import { Box } from "@mui/material";
import { View } from "react-native";
import { MoonLoader } from "react-spinners";
import { useUserDataStatus } from "../../modules/SectionActors/UserDataActor";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import ChunkTitle from "../general/ChunkTitle";
import { Row } from "../general/Row";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { AccountPageDeal } from "./AccountPageDeal";

function useFilteredDeals() {
  const main = useGetterSectionOnlyOne("main");
  const feStore = main.onlyChild("feStore");
  const dealMenu = main.onlyChild("mainDealMenu");

  const showArchived = dealMenu.valueNext("showArchived");
  const dealNameFilter = dealMenu.valueNext("dealNameFilter");
  const deals = feStore.children("dealMain");
  return deals.filter((deal) => {
    if (!showArchived && deal.valueNext("archived")) {
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
  const dealMenu = main.onlyChild("mainDealMenu");
  const deals = useFilteredSortedDeals();

  const dataStatus = useUserDataStatus();
  const loading = dataStatus === "loading";
  return (
    <Row
      style={{
        // ...nativeTheme.mainSection,
        flex: 1,
        height: "100%",
        margin: nativeTheme.dealMenuElement.margin,
        justifyContent: "center",
        paddingLeft: nativeTheme.s45,
        paddingRight: nativeTheme.s45,
        paddingBottom: nativeTheme.s5,
        paddingTop: nativeTheme.s4,
        borderColor: nativeTheme.primary.main,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: nativeTheme.br0,
        backgroundColor: nativeTheme.light,
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
            <Box
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
            </Box>
            <Box
              sx={{
                mt: nativeTheme.s35,
                width: "100%",
              }}
            >
              {deals.map(({ feId }, idx) => (
                <AccountPageDeal
                  {...{
                    key: feId,
                    feId,
                    ...(idx === deals.length - 1 && {
                      style: { borderBottomWidth: 1 },
                    }),
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </View>
    </Row>
  );
}
