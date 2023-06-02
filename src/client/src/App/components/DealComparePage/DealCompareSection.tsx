import { View } from "react-native";
import { useGetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { PageTitle } from "../appWide/PageTitle";
import { DealModeProvider } from "../customContexts/dealModeContext";
import { ComparedDeal } from "./ComparedDeal";
import { ComparedDealXBtns } from "./ComparedDealXBtns";
import { DealCompareDealModal } from "./DealCompareDealModal";
import { DealCompareValueMenu } from "./DealCompareValueMenu";

export function DealCompareSection() {
  const main = useGetterMain();
  const dealCompare = main.onlyChild("dealCompare");
  const compareValueFeIds = dealCompare.childFeIds("compareValue");
  const comparedFeIds = dealCompare.childFeIds("comparedDealSystem");

  const areCompareDeals = comparedFeIds.length > 0;
  return (
    <BackBtnWrapper {...{ label: "Deal Menu", to: "account" }}>
      <DealModeProvider dealMode={"mixed"}>
        <SubSectionOpen>
          <PageTitle
            text={
              "Compare Deals"
              // <LabelWithInfo
              //   {...{
              //     label: "Compare",
              //     infoTitle: "Compare",
              //     infoText: `Compare deals side-by-side. Just click the "+" button to add a deal, and choose which values to compare by adding or subtracting values at the top of the page.`,
              //   }}
              // />
            }
          />
          <View
            style={{
              flexWrap: "nowrap",
              marginTop: nativeTheme.s4,
              marginBottom: nativeTheme.s4,
              flexDirection: "row",
            }}
          >
            <View>
              <View style={{ flexDirection: "row" }}>
                {areCompareDeals && (
                  <ComparedDealXBtns {...{ compareValueFeIds }} />
                )}
                {comparedFeIds.map((feId, idx) => (
                  <ComparedDeal
                    {...{
                      style: {
                        ...(idx === 0 && {
                          borderTopLeftRadius: nativeTheme.br0,
                        }),
                      },
                      key: feId,
                      feId,
                    }}
                  />
                ))}
              </View>
              {areCompareDeals && <DealCompareValueMenu />}
            </View>
            <DealCompareDealModal {...{ dealCount: comparedFeIds.length }} />
          </View>
        </SubSectionOpen>
      </DealModeProvider>
    </BackBtnWrapper>
  );
}
