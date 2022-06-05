import { View } from "react-native";
import styled from "styled-components";
import theme from "../../../theme/Theme";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import MainSectionTitleSaveBtn from "../../appWide/GeneralSection/MainSection/MainSectionTitleRowTitle.tsx/MainSectionTitleSaveBtn";
import { useGetterSection } from "./../../../sharedWithServer/StateHooks/useGetterSection";
import { MainSectionTitleRowTitleNext } from "./../../appWide/GeneralSection/MainSection/MainSectionTitleRowTitle.tsx/MainSectionTitleRowTitleNext";
import DealDetails from "./Deal/DealDetails";
import DealOutputList from "./Deal/DealOutputList";

export function Deal({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  const deal = useGetterSection({
    sectionName: "analysis",
    feId: feId,
  });
  const outputListId = deal.onlyChildFeId("dealOutputList");
  return (
    <MainSection>
      <View style={{ flexDirection: "row" }}>
        <MainSectionTitleRowTitleNext feInfo={deal.feInfo} />
        <MainSectionTitleSaveBtn feInfo={deal.feInfo} />
      </View>
      {/* <MainSectionTitleRow
        {...{ feInfo, pluralName: "deals", droptop: true }}
      /> */}
      <MainSectionBody>
        <Styled className="ListGroup-root">
          <div className="Deal-viewable viewable">
            {!detailsIsOpen && <DealOutputList feId={outputListId} />}
            {detailsIsOpen && <DealDetails feId={outputListId} />}
          </div>
        </Styled>
      </MainSectionBody>
    </MainSection>
  );
}
const Styled = styled.div`
  background: ${theme.analysis.main};
  border: solid 1px ${theme.analysis.border};
  border-radius: ${theme.s1};
  box-shadow: ${theme.boxShadow1};
  .MainSection-entry {
    padding-bottom: ${theme.s2};
  }
`;
