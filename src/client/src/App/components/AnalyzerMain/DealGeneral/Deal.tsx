import { View } from "react-native";
import styled from "styled-components";
import { InfoS } from "../../../sharedWithServer/SectionsMeta/Info";
import theme from "../../../theme/Theme";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import MainSectionTitleRowTitle from "../../appWide/GeneralSection/MainSection/MainSectionTitleRowTitle.tsx/MainSectionTitleRowTitle";
import MainSectionTitleSaveBtn from "../../appWide/GeneralSection/MainSection/MainSectionTitleRowTitle.tsx/MainSectionTitleSaveBtn";
import DealBasics from "./Deal/DealBasics";
import DealDetails from "./Deal/DealDetails";

export default function Deal({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  const feInfo = InfoS.fe("analysis", feId);
  return (
    <MainSection>
      <View style={{ flexDirection: "row" }}>
        <MainSectionTitleRowTitle feInfo={feInfo} />
        <MainSectionTitleSaveBtn feInfo={feInfo} />
      </View>
      {/* <MainSectionTitleRow
        {...{ feInfo, pluralName: "deals", droptop: true }}
      /> */}
      <MainSectionBody>
        <Styled className="ListGroup-root">
          <div className="Deal-viewable viewable">
            {!detailsIsOpen && <DealBasics id={feId} />}
            {detailsIsOpen && <DealDetails id={feId} />}
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
