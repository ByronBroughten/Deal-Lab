import { View } from "react-native";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { MainSectionBtnNative } from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionBtnNative";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { ModalSection } from "../appWide/ModalSection";
import { SectionTitle } from "../appWide/SectionTitle";
import { ComparedDeal } from "./ComparedDeal";
import { DealCompareSelectMenu } from "./DealCompareSelectMenu";

export function DealCompareSection() {
  const main = useGetterSectionOnlyOne("main");
  const dealCompare = main.onlyChild("dealCompare");
  const compareValueFeIds = dealCompare.childFeIds("compareValue");
  const comparePageFeIds = dealCompare.childFeIds("compareDealPage");
  const { dealMenuIsOpen, openDealMenu, closeDealMenu } =
    useToggleView("dealMenu");

  // For now I'll let it pick from Deal, Property, Financing, and Mgmt
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
            {comparePageFeIds.map((feId) => (
              <ComparedDeal
                {...{
                  key: feId,
                  feId,
                  compareValueFeIds,
                  style: { marginRight: nativeTheme.s3 },
                }}
              />
            ))}
          </View>
          {/* {comparePageFeIds.length > 0 && (
            <MainSectionBtnNative
              {...{
                middle: "+ Value",
                style: { height: 50, marginRight: nativeTheme.s3 },
              }}
            />
          )} */}
        </View>
        <MainSectionBtnNative
          {...{
            middle: "+ Deal",
            style: { width: 120, maxHeight: 500, minHeight: 300 },
            onClick: openDealMenu,
          }}
        />
      </View>
      <ModalSection
        {...{
          title: "Select a Deal to Compare",
          closeModal: closeDealMenu,
          show: dealMenuIsOpen,
        }}
      >
        <DealCompareSelectMenu closeMenu={closeDealMenu} />
      </ModalSection>
    </OuterMainSection>
  );
}
