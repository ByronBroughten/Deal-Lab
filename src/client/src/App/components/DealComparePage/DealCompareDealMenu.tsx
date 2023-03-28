import { unstable_batchedUpdates } from "react-dom";
import { View } from "react-native";
import styled from "styled-components";
import { useGetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { MaterialStringEditor } from "../inputs/MaterialStringEditor";

function useGetFilteredDeals(): GetterSection<"deal">[] {
  const main = useGetterMain();
  const feStore = main.onlyChild("feStore");
  const deals = feStore.children("dealMain");

  const compareSection = main.onlyChild("dealCompare");
  const nameFilter = compareSection.valueNext("dealNameFilter");
  const nameFilteredDeals = deals.filter((deal) =>
    deal
      .valueNext("displayName")
      .mainText.toLowerCase()
      .includes(nameFilter.toLowerCase())
  );

  const dealSystems = compareSection.children("comparedDealSystem");
  const comparedSystems = dealSystems.map((page) => page.onlyChild("deal"));
  const comparedDbIds = comparedSystems.map(({ dbId }) => dbId);
  return nameFilteredDeals.filter((deal) => !comparedDbIds.includes(deal.dbId));
}

type Props = { closeMenu: () => void };
export function DealCompareDealMenu({ closeMenu }: Props) {
  const compareSection = useSetterSectionOnlyOne("compareSection");
  const nameFilterVarb = compareSection.varb("dealNameFilter");
  const filteredDeals = useGetFilteredDeals();
  return (
    <View>
      <MaterialStringEditor
        {...{
          ...nameFilterVarb.feVarbInfo,
          placeholder: "Filter",
          style: { minWidth: 120 },
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
              <SectionBtn
                middle={displayName}
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  padding: nativeTheme.s1,
                  paddingLeft: nativeTheme.s3,
                  paddingRight: nativeTheme.s3,
                }}
                onClick={() => {
                  unstable_batchedUpdates(() => {
                    const dealSystem =
                      compareSection.addAndGetChild("comparedDealSystem");
                    const dealToCompare = dealSystem.onlyChild("deal");
                    dealToCompare.loadSelfSectionPack(
                      deal.packMaker.makeSectionPack()
                    );
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
const SectionBtn = styled(PlainIconBtn)`
  :hover {
    background-color: ${nativeTheme["gray-400"]};
  }
`;
