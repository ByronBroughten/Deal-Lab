import { View } from "react-native";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { SectionTitle } from "../appWide/SectionTitle";
import { ComparedDeal } from "./ComparedDeal";
import { ComparedDealXBtns } from "./ComparedDealXBtns";
import { DealCompareDealModal } from "./DealCompareDealModal";
import { DealCompareValueMenu } from "./DealCompareValueMenu";

export function DealCompareSection() {
  const main = useGetterSectionOnlyOne("main");
  const dealCompare = main.onlyChild("dealCompare");
  const compareValueFeIds = dealCompare.childFeIds("compareValue");
  const comparePageFeIds = dealCompare.childFeIds("compareDealPage");

  return (
    <OuterMainSection>
      <SectionTitle
        className="UserEditorTitleRow-sectionTitle"
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
          marginTop: nativeTheme.s35,
          flexDirection: "row",
        }}
      >
        <View>
          <View style={{ flexDirection: "row", paddingBottom: nativeTheme.s2 }}>
            <ComparedDealXBtns {...{ compareValueFeIds }} />
            {comparePageFeIds.map((feId) => (
              <ComparedDeal
                {...{
                  key: feId,
                  feId,
                  style: { marginRight: nativeTheme.s3 },
                }}
              />
            ))}
          </View>
          {comparePageFeIds.length > 0 && <DealCompareValueMenu />}
        </View>
        <DealCompareDealModal />
      </View>
    </OuterMainSection>
  );
}
