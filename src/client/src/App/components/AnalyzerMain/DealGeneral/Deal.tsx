import styled from "styled-components";
import { Inf } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import theme from "../../../theme/Theme";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import MainSectionTitleRow from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import DealBasics from "./Deal/DealBasics";
import DealDetails from "./Deal/DealDetails";

export default function Deal({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  const feInfo = Inf.fe("analysis", feId);
  return (
    <MainSection>
      <MainSectionTitleRow
        {...{ feInfo, pluralName: "deals", droptop: true }}
      />
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
