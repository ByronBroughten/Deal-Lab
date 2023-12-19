import { Box } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import { View } from "react-native";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { useAction } from "../../stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../stateClassHooks/useGetterSection";
import { useGetterMain } from "../../stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { icons } from "../Icons";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { MaterialStringEditor } from "../inputs/MaterialStringEditor";

function useFilteredDealsToCompare(): GetterSection<"deal">[] {
  const main = useGetterMain();
  const feStore = main.onlyChild("feStore");
  const deals = feStore.children("dealMain");

  const mainMenu = feStore.onlyChild("dealCompareMenu");

  const selectMenu = main.onlyChild("dealCompareDealSelectMenu");
  const nameFilter = selectMenu.valueNext("dealNameFilter");
  const nameFilteredDeals = deals.filter((deal) =>
    deal
      .valueNext("displayName")
      .mainText.toLowerCase()
      .includes(nameFilter.toLowerCase())
  );

  const comparedDbIds = mainMenu.childrenDbIds("comparedDeal");
  return nameFilteredDeals.filter(
    (deal) =>
      !comparedDbIds.includes(deal.dbId) && !deal.valueNext("isArchived")
  );
}

type Props = { closeMenu: () => void };
export function DealCompareDealSelectMenu({ closeMenu }: Props) {
  const compareMenu = useGetterSectionOnlyOne("dealCompareMenu");
  const addChild = useAction("addChild");
  const addToCompare = (dbId: string) =>
    addChild({
      feInfo: compareMenu.feInfo,
      childName: "comparedDeal",
      options: { dbId },
    });

  const selectMenu = useGetterSectionOnlyOne("dealCompareDealSelectMenu");
  const nameFilterVarb = selectMenu.varbNext("dealNameFilter");
  const filteredDeals = useFilteredDealsToCompare();
  return (
    <View>
      <MaterialStringEditor
        {...{
          ...nameFilterVarb.feVarbInfo,
          placeholder: "Filter",
          sx: {
            "& .DraftEditor-root": {
              minWidth: 120,
            },
          },
        }}
      />
      <View
        style={{
          marginTop: nativeTheme.s25,
          ...nativeTheme.subSection.borderLines,
          borderRadius: nativeTheme.br0,
        }}
      >
        {filteredDeals.length === 0 && (
          <Box
            sx={{
              padding: nativeTheme.s3,
              fontSize: nativeTheme.inputLabel.fontSize,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {"None"}
          </Box>
        )}
        {filteredDeals.length > 0 &&
          filteredDeals.map((deal, idx) => {
            const displayName = deal.valueNext("displayName").mainText;
            return (
              <View
                key={deal.feId}
                style={{
                  borderStyle: "solid",
                  borderTopWidth: idx === 0 ? 0 : 1,
                  borderColor: nativeTheme.subSection.borderLines.borderColor,
                  minWidth: 200,
                  padding: 0,
                  flexWrap: "nowrap",
                }}
              >
                <PlainIconBtn
                  left={icons[deal.valueNext("dealMode")]()}
                  middle={displayName || "Untitled"}
                  sx={{
                    color: nativeTheme.primary.main,
                    ...(!displayName && { fontStyle: "italic" }),
                    display: "flex",
                    fontSize: 16,
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    padding: nativeTheme.s1,
                    paddingLeft: nativeTheme.s3,
                    paddingRight: nativeTheme.s3,
                    "&:hover": {
                      backgroundColor: nativeTheme["gray-400"],
                    },
                  }}
                  onClick={() => {
                    unstable_batchedUpdates(() => {
                      addToCompare(deal.dbId);
                      closeMenu();
                    });
                  }}
                />
              </View>
            );
          })}
      </View>
    </View>
  );
}
