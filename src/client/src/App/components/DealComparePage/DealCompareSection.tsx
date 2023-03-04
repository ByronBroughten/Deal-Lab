import { BiPlus } from "react-icons/bi";
import { Text, View } from "react-native";
import styled from "styled-components";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { ValueInEntityInfo } from "../../sharedWithServer/SectionsMeta/values/StateValue/valuesShared/entities";
import {
  useGetterSection,
  useGetterSectionOnlyOne,
} from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { MainSectionBtn } from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionBtn";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { ModalSection } from "../appWide/ModalSection";
import { SectionTitle } from "../appWide/SectionTitle";
import { DealCompareSelectMenu } from "./DealCompareSelectMenu";

export function DealCompareSection() {
  const main = useGetterSectionOnlyOne("main");
  const dealCompare = main.onlyChild("dealCompare");
  const compareValueSections = dealCompare.children("compareValue");
  const compareValues = compareValueSections.map((section) =>
    section.valueEntityInfo()
  );

  const comparePageFeIds = dealCompare.childFeIds("compareDealPage");
  const { dealMenuIsOpen, openDealMenu, closeDealMenu } =
    useToggleView("dealMenu");
  return (
    <Styled>
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
      <View style={{ marginTop: nativeTheme.s35 }}>
        {comparePageFeIds.map((feId) => (
          <DealPlaceholder
            {...{
              feId,
              compareValues,
            }}
          />
        ))}
        <MainSectionBtn
          {...{
            middle: <BiPlus />,
            style: { width: 100, height: 300 },
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
        <DealCompareSelectMenu />
      </ModalSection>
    </Styled>
  );
}

type Props = { feId: string; compareValues: ValueInEntityInfo[] };
function DealPlaceholder({ feId, compareValues }: Props) {
  const dealPage = useGetterSection({ sectionName: "dealPage", feId });
  const deal = dealPage.onlyChild("deal");
  return (
    <View>
      <View>
        <Text>{deal.valueNext("displayName").mainText}</Text>
      </View>
      {compareValues.map((info) => {
        const varb = dealPage.varbByFocalMixed(info);
        return (
          <View>
            <View>
              <Text>{varb.displayName}</Text>
            </View>
            <View>{varb.displayVarb()}</View>
          </View>
        );
      })}
    </View>
  );
}

const Styled = styled(OuterMainSection)``;
