import { Inf } from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import MainSectionEntry from "../../../appWide/MainSection/MainSectionEntry";
import MainEntryBody from "../../../appWide/MainSection/MainSectionEntry/MainEntryBody";
import MainEntryTitleRow from "../../../appWide/MainSection/MainSectionEntry/MainEntryTitleRow";
import AnalysisBasics from "./Deal/DealBasics";
import AnalysisDetails from "./Deal/DealDetails";
import styled from "styled-components";
import theme from "../../../../theme/Theme";

export default function Deal({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  const feInfo = Inf.fe("analysis", feId);
  return (
    <MainSectionEntry>
      <MainEntryTitleRow {...{ feInfo, pluralName: "deals", droptop: true }} />
      <MainEntryBody>
        <Styled className="ListGroup-root">
          <div className="Deal-viewable viewable">
            {!detailsIsOpen && <AnalysisBasics id={feId} />}
            {detailsIsOpen && <AnalysisDetails id={feId} />}
          </div>
        </Styled>
      </MainEntryBody>
    </MainSectionEntry>
  );
}
const Styled = styled.div`
  background: ${theme.analysis.main};
  border: solid 1px ${theme.analysis.border};
  border-radius: ${theme.s1};
`;
