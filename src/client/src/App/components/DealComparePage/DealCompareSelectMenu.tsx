import { unstable_batchedUpdates } from "react-dom";
import { View } from "react-native";
import styled from "styled-components";
import { Id } from "../../sharedWithServer/SectionsMeta/id";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { MaterialStringEditor } from "../inputs/MaterialStringEditor";

export function DealCompareSelectMenu() {
  const feUser = useGetterSectionOnlyOne("feUser");
  const deals = feUser.children("dealMain");
  const compareSection = useSetterSectionOnlyOne("compareSection");
  const nameFilterVarb = compareSection.varb("nameFilter");
  const nameFilter = nameFilterVarb.value("string");
  const filteredDeals = deals.filter((deal) =>
    deal
      .valueNext("displayName")
      .mainText.toLowerCase()
      .includes(nameFilter.toLowerCase())
  );
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
                }}
                onClick={() => {
                  unstable_batchedUpdates(() => {
                    const feId = Id.make();
                    const dealPage = compareSection.addAndGetChild(
                      "compareDealPage",
                      {
                        feId,
                        contextPathIdxSpecifier: {
                          2: {
                            selfChildName: "compareDealPage",
                            feId,
                          },
                        },
                      }
                    );
                    const dealToCompare = dealPage.onlyChild("deal");
                    dealToCompare.loadSelfSectionPack(
                      deal.packMaker.makeSectionPack()
                    );
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
