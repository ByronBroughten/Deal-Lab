import { Box } from "@mui/material";
import { Text, View } from "react-native";
import { MoonLoader } from "react-spinners";
import { useUserDataStatus } from "../../modules/customHooks/UserDataActor";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { Row } from "../general/Row";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { AccountPageDeal } from "./AccountPageDeal";

function useFilteredDeals() {
  const main = useGetterSectionOnlyOne("main");
  const feUser = main.onlyChild("feUser");
  const dealMenu = main.onlyChild("mainDealMenu");
  const dealNameFilter = dealMenu.valueNext("dealNameFilter");

  const deals = feUser.children("dealMain");
  return deals.filter((deal) =>
    deal.stringValue("displayName").includes(dealNameFilter)
  );
}

export const accountPageElementMargin = nativeTheme.s3;
export function AccountPageDeals() {
  const main = useGetterSectionOnlyOne("main");
  const dealMenu = main.onlyChild("mainDealMenu");
  const deals = useFilteredDeals();

  const dataStatus = useUserDataStatus();
  const loading = dataStatus === "loading";
  return (
    <Row
      style={{
        ...nativeTheme.mainSection,
        flex: 1,
        height: "100%",
        margin: nativeTheme.dealMenuElement.margin,
        justifyContent: "center",
        paddingLeft: nativeTheme.s45,
        paddingRight: nativeTheme.s45,
        paddingBottom: nativeTheme.s5,
      }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text
          style={{
            fontSize: nativeTheme.fs22,
            color: nativeTheme.primary.main,
          }}
        >
          Saved Deals
        </Text>
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
                  placeholder: "Filter by deal title",
                  feVarbInfo: dealMenu.varbInfo("dealNameFilter"),
                }}
              />
            </Box>
            <Box
              sx={{
                mt: nativeTheme.s3,
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
