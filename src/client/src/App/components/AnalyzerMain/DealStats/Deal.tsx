import { View } from "react-native";
import styled from "styled-components";
import { InfoS } from "../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../sharedWithServer/StateHooks/useSetterSection";
import theme from "../../../theme/Theme";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import MainSectionTitleRowTitle from "../../appWide/GeneralSection/MainSection/MainSectionTitleRowTitle.tsx/MainSectionTitleRowTitle";
import MainSectionTitleSaveBtn from "../../appWide/GeneralSection/MainSection/MainSectionTitleRowTitle.tsx/MainSectionTitleSaveBtn";
import DealDetails from "./Deal/DealDetails";
import DealOutputList from "./Deal/DealOutputList";

export function Deal({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  const sectionName = "analysis";

  const main = useSetterSection();
  const dealFeId = main.oneChildFeId(sectionName);
  const deal = useSetterSection({
    sectionName,
    feId: dealFeId,
  });

  const outputListId = deal.oneChildFeId("dealOutputList");

  const feInfo = InfoS.fe(sectionName, feId);
  const feSectionInfo = {
    sectionName,
    feId,
  } as const;

  return (
    <MainSection>
      <View style={{ flexDirection: "row" }}>
        <MainSectionTitleRowTitle feInfo={feInfo} />
        <MainSectionTitleSaveBtn feInfo={feSectionInfo} />
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
