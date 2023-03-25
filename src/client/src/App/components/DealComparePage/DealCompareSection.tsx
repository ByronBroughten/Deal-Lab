import { View } from "react-native";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { SectionTitle } from "../appWide/SectionTitle";
import { ComparedDeal } from "./ComparedDeal";
import { ComparedDealXBtns } from "./ComparedDealXBtns";
import { DealCompareDealModal } from "./DealCompareDealModal";
import { DealCompareValueMenu } from "./DealCompareValueMenu";

export function DealCompareSection() {
  const feUser = useGetterSectionOnlyOne("feUser");
  const dealCompare = feUser.onlyChild("dealCompare");
  const compareValueFeIds = dealCompare.childFeIds("compareValue");
  const comparePageFeIds = dealCompare.childFeIds("compareDealPage");

  const areCompareDeals = comparePageFeIds.length > 0;
  return (
    <BackBtnWrapper {...{ label: "Deal Menu", to: "account" }}>
      <SubSectionOpen>
        <SectionTitle
          text={
            <LabelWithInfo
              {...{
                label: "Compare",
                infoTitle: "Compare",
                infoText: `This page lets you compare deals side-by-side. Just click the "+" button to add a deal, and choose which values to compare by adding or subtracting values at the top of the page.`,
              }}
            />
          }
        />
        <View
          style={{
            flexWrap: "nowrap",
            marginTop: nativeTheme.s4,
            flexDirection: "row",
          }}
        >
          <View>
            <View style={{ flexDirection: "row" }}>
              {areCompareDeals && (
                <ComparedDealXBtns {...{ compareValueFeIds }} />
              )}
              {comparePageFeIds.map((feId, idx) => (
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
          <DealCompareDealModal {...{ dealCount: comparePageFeIds.length }} />
        </View>
      </SubSectionOpen>
    </BackBtnWrapper>
  );
}
