import { unstable_batchedUpdates, View } from "react-native";
import styled from "styled-components";
import { Id } from "../../sharedWithServer/SectionsMeta/id";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { MaterialStringEditor } from "../inputs/MaterialStringEditor";

export function DealSectionMenu() {
  const feUser = useGetterSectionOnlyOne("feUser");
  const deals = feUser.children("dealMain");
  const compareSection = useSetterSectionOnlyOne("compareSection");
  const nameFilterVarb = compareSection.varb("nameFilter");
  const nameFilter = nameFilterVarb.value("string");
  const filteredDeals = deals.filter((deal) =>
    nameFilter.includes(deal.valueNext("displayName").mainText)
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
      {filteredDeals.map((deal) => {
        const displayName = deal.valueNext("displayName").mainText;
        return (
          <View
            style={{
              minWidth: 200,
              padding: 0,
              flexWrap: "nowrap",
            }}
          >
            <SectionBtn
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
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </SectionBtn>
          </View>
        );
      })}
    </View>
  );
}
const SectionBtn = styled(PlainIconBtn)`
  :hover {
    background-color: ${nativeTheme["gray-400"]};
  }
`;
