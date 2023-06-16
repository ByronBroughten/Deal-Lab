import { unstable_batchedUpdates } from "react-dom";
import { View } from "react-native";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { icons } from "../Icons";
import { MaterialStringEditor } from "../inputs/MaterialStringEditor";

function useGetFilteredDeals(): GetterSection<"deal">[] {
  const main = useGetterMain();
  const feStore = main.onlyChild("feStore");
  const deals = feStore.children("dealMain");

  const dealCompareMainMenu = main.onlyChild("dealCompare");
  const nameFilter = dealCompareMainMenu.valueNext("dealNameFilter");
  const nameFilteredDeals = deals.filter((deal) =>
    deal
      .valueNext("displayName")
      .mainText.toLowerCase()
      .includes(nameFilter.toLowerCase())
  );

  const dealSystems = dealCompareMainMenu.children("comparedDealSystem");
  const comparedSystems = dealSystems.map((page) => page.onlyChild("deal"));
  const comparedDbIds = comparedSystems.map(({ dbId }) => dbId);
  return nameFilteredDeals.filter((deal) => !comparedDbIds.includes(deal.dbId));
}

type Props = { closeMenu: () => void };
export function DealCompareDealSelectMenu({ closeMenu }: Props) {
  const addDealToCompare = useAction("addDealToCompare");

  const menu = useSetterSectionOnlyOne("dealCompareMainMenu");
  const nameFilterVarb = menu.varb("dealNameFilter");
  const filteredDeals = useGetFilteredDeals();
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
        {filteredDeals.map((deal, idx) => {
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
                    addDealToCompare({ feId: deal.feId });
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
