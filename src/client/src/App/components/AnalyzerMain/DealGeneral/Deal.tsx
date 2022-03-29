import { Inf } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import MainSectionTitleRow from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import AnalysisBasics from "./Deal/DealBasics";
import AnalysisDetails from "./Deal/DealDetails";
import styled from "styled-components";
import theme from "../../../theme/Theme";

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
            {!detailsIsOpen && <AnalysisBasics id={feId} />}
            {detailsIsOpen && <AnalysisDetails id={feId} />}
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
